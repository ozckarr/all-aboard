import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../redux/user/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <section className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image*"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          <div
            style={{
              backgroundImage: `url(${
                formData.profilePicture || currentUser.profilePicture
              })`,
            }}
            className="profile-img-big"
            onClick={() => fileRef.current.click()}
          ></div>
          {imageError ? (
            <span className="">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="">Image uploaded successfully</span>
          ) : (
            ""
          )}
          <div className="form-group">
            <input
              defaultValue={currentUser.username}
              type="name"
              className="form-control"
              id="username"
              name="username"
              placeholder="Your Username"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              defaultValue={currentUser.email}
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Your Email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Your Password"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <button disabled={loading} type="submit" className="btn btn-block">
              {loading ? "Loading..." : "Update"}
            </button>
          </div>
          <p>{error && "Something went wrong!"}</p>
          <p>{updateSuccess && "User is updated successfully!"}</p>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block"
              onClick={handleSignOut}
              style={{ backgroundColor: "#8B0000" }}
            >
              Sign out
            </button>
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block"
              style={{ backgroundColor: "red" }}
              onClick={handleDeleteAccount}
            >
              Delete
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
