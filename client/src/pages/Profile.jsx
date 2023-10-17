import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  uploadBytes,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const loading = false;

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

  return (
    <div className="container">
      <section className="form">
        <form>
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
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
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
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block"
              style={{ backgroundColor: "#8B0000" }}
            >
              Log out
            </button>
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block"
              style={{ backgroundColor: "red" }}
            >
              Delete
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
