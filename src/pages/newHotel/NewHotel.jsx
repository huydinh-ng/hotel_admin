import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import classes from "./newHotel.module.css";

const NewHotel = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [selectImage, setSelectImage] = useState("");
  const [images, setImages] = useState([]);
  const [info, setInfo] = useState({ city: "Ha Noi", type: "hotel" });
  const [rooms, setRooms] = useState([]);
  const [selectRoom, setSelectRoom] = useState("");
  const [roomsChoosed, setRoomsChoosed] = useState([]);
  const token = Cookies.get("access_token");
  const [isErr, setIsErr] = useState(false);
  const { data, loading } = useFetch("/rooms");

  const handleChange = (e) => {
    setIsErr(false);
    if (e.target.id === "featured") {
      setInfo((prev) => ({
        ...prev,
        [e.target.id]: e.target.value === "true",
      }));
    } else {
      setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleSelectRooms = (e) => {
    setIsErr(false);
    const value = Array.from(e.target.selectedOptions, (option) => {
      return option.value;
    });
    setRooms({
      id: value[0].split(",")[0],
      title: value[0].split(",")[1],
      price: Number(value[0].split(",")[2]),
      desc: value[0].split(",").splice(3).join(","),
    });
  };

  const handleChangeImage = (e) => {
    setIsErr(false);
    setImage(e.target.value);
  };

  const handleAddImage = (e) => {
    setIsErr(false);
    e.preventDefault();
    setImages((preImages) => [...preImages, image]);
    setImage("");
  };

  const handleRemoveImage = (e) => {
    setIsErr(false);
    e.preventDefault();
    if (images.length > 1) {
      setImages((preImages) => preImages.filter((i) => i !== selectImage));
    } else {
      setImages([]);
    }
  };

  const handleSelectImages = (e) => {
    setIsErr(false);
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectImage(value[0]);
  };

  const handleChooseRoom = (e) => {
    setIsErr(false);
    e.preventDefault();
    setRoomsChoosed((preRooms) => {
      const check = preRooms.map((r) => r.id).some((id) => id === rooms.id);
      if (check) {
        return preRooms;
      } else {
        return [
          ...preRooms,
          {
            id: rooms.id,
            title: rooms.title,
            price: rooms.price,
            desc: rooms.desc,
          },
        ];
      }
    });
  };

  const handleSelectRoomChoosed = (e) => {
    setIsErr(false);
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectRoom(value[0]);
  };

  const handleRemoveRoomsChoosed = (e) => {
    setIsErr(false);
    e.preventDefault();
    if (roomsChoosed.length > 1) {
      setRoomsChoosed((preRooms) =>
        preRooms.filter((r) => r.id !== selectRoom)
      );
    } else {
      setRoomsChoosed([]);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const newhotel = {
      ...info,
      rooms: roomsChoosed.map((r) => r.id),
      photos: images,
    };

    try {
      const res = await axios.post("/hotels", newhotel, {
        headers: {
          Authorization: token,
        },
      });
      navigate("/hotels");
    } catch (err) {
      setIsErr(true);
    }
  };
  return (
    <div className={classes.new}>
      <Sidebar />
      <div className={classes.newContainer}>
        <div className={classes.top}>
          <h1>Add New Product</h1>
        </div>
        <div className={classes.bottom}>
          <div className={classes.right}>
            <form>
              {hotelInputs.map((input) => {
                if (input.readonly) {
                  return (
                    <div className={classes.formInput} key={input.id}>
                      <label>{input.label} (ReadOnly)</label>
                      <p>Choose rooms to display</p>
                      <select className={classes.listImages} multiple>
                        {roomsChoosed.map((room, index) => (
                          <option key={index}>
                            {room.title}
                            {input.label === "Price"
                              ? ` : $${room.price}`
                              : ` : ${room.desc}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                } else if (input.option === "type") {
                  return (
                    <div className={classes.formInput} key={input.id}>
                      <label>{input.label}</label>
                      <select
                        id={input.id}
                        onChange={handleChange}
                        type={input.type}
                      >
                        <option>hotel</option>
                        <option>apartments</option>
                        <option>resort</option>
                        <option>villas</option>
                        <option>cabins</option>
                      </select>
                    </div>
                  );
                } else if (input.option === "city") {
                  return (
                    <div className={classes.formInput} key={input.id}>
                      <label>{input.label}</label>
                      <select
                        id={input.id}
                        onChange={handleChange}
                        type={input.type}
                      >
                        <option>Ha Noi</option>
                        <option>Ho Chi Minh</option>
                        <option>Da Nang</option>
                      </select>
                    </div>
                  );
                } else {
                  return (
                    <div className={classes.formInput} key={input.id}>
                      <label>{input.label}</label>
                      <input
                        id={input.id}
                        onChange={handleChange}
                        type={input.type}
                        placeholder={input.placeholder}
                      />
                    </div>
                  );
                }
              })}
              <div className={classes.formInput}>
                <label>Images</label>
                <div className={classes.listImagesContainer}>
                  <input
                    type="text"
                    value={image}
                    onChange={handleChangeImage}
                    placeholder="Link image"
                    className={classes.inputImage}
                  />
                  <button
                    onClick={handleAddImage}
                    className={classes.btnAddImage}
                  >
                    Add Image
                  </button>
                </div>
                <div className={classes.listImagesContainer}>
                  <select
                    className={classes.listImages}
                    id="images"
                    multiple
                    onChange={handleSelectImages}
                  >
                    {images.map((image, index) => (
                      <option key={index} value={image}>
                        {image}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRemoveImage}
                    className={classes.btnRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className={classes.formInput}>
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className={classes.selectRooms}>
                <label>Rooms</label>
                <div className={classes.listImagesContainer}>
                  <select id="rooms" multiple onChange={handleSelectRooms}>
                    {loading
                      ? "loading"
                      : data &&
                        data.map((room) => (
                          <option
                            key={room._id}
                            value={`${room._id},${room.title},${room.price},${room.desc}`}
                          >
                            {room.title}
                          </option>
                        ))}
                  </select>
                  <button
                    onClick={handleChooseRoom}
                    className={classes.btnChooseRoom}
                  >
                    Choose Room
                  </button>
                </div>
                <p>List Rooms Choosed</p>
                <div className={classes.listImagesContainer}>
                  <select
                    className={classes.listImages}
                    id="roomsChoosed"
                    multiple
                    onChange={handleSelectRoomChoosed}
                  >
                    {roomsChoosed.map((room, index) => (
                      <option key={index} value={room.id}>
                        {room.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRemoveRoomsChoosed}
                    className={classes.btnRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
            {isErr &&
              (token ? (
                <p style={{ color: "red" }}>
                  Input not empty! Please check infomation on inputs!
                </p>
              ) : (
                <p style={{ color: "red" }}>Please LogIn!</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
