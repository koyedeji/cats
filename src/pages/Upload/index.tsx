import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames";
import * as CatApi from "api/catApi";
import s from "./Upload.module.scss";

interface ImgState {
  imgUrl: ArrayBuffer | string | null;
  file: File | null;
  error: string;
}

const UpLoadPage = () => {
  const history = useHistory();
  const [imgObj, setImageObj] = useState<ImgState>({
    file: null,
    imgUrl: "",
    error: "",
  });

  // TODO: Show loading indication when uploading from computer
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files![0]) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (reader.readyState === 2) {
        setImageObj((prev) => ({
          ...prev,
          file: event.target.files![0],
          imgUrl: reader.result,
          error: "",
        }));
      }
    };
    reader.readAsDataURL(event.target.files![0]);
  };

  // TODO: Show loading indication when uploading to the server
  const handleUpload = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { file } = imgObj;
    const { error } = await CatApi.upload("images/upload", {
      file,
    });

    if (error) {
      setImageObj((prev) => ({ ...prev, error: error }));
      return;
    }
    history.push("/");
  };

  const rootClassnames = cn("container", s.root);

  const { error, imgUrl } = imgObj;

  return (
    <section className={cn("section")}>
      <div className={cn(rootClassnames)}>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <div className="container-sm">
          <div className={s.wrapper}>
            <div className={cn(s.header)}>
              <button onClick={handleUpload} type="button" disabled={!imgUrl}>
                upload
              </button>
            </div>
            <div className={cn(s.imgContainer)}>
              <img
                className={cn("responsive-img", s.img)}
                src={
                  String(imgUrl) ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3hTQwsrGuYW0XGXbIB4d2noVL1ZhL7llERA&usqp=CAU"
                }
                alt="cat"
              />
            </div>

            <div className={cn(s.inputWrapper)}>
              <input
                onChange={handleChange}
                id="imageUpload"
                type="file"
                accept="image/png, image/jpeg"
              />
              <label htmlFor="imageUpload">Choose a file</label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpLoadPage;
