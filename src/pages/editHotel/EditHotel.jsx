import Sidebar from "../../components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./editHotel.module.css";
import { useNavigate, useParams } from "react-router-dom";

const EditHotel = () => {
  const params = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("access_token");
  const [image, setImage] = useState("");
  const [selectImage, setSelectImage] = useState("");
  const [images, setImages] = useState([]);
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectRoom, setSelectRoom] = useState("");
  const [roomsChoosed, setRoomsChoosed] = useState([]);
  const { data, loading } = useFetch("/rooms");
  const [isErr, setIsErr] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/hotels/find/${params.hotelId}`);
        setInfo({
          name: res.data.name,
          type: res.data.type,
          city: res.data.city,
          address: res.data.address,
          distance: res.data.distance,
          desc: res.data.desc,
          featured: Boolean(res.data.featured),
        });
        setImages(res.data.photos);
        setRoomsChoosed(res.data.rooms);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

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
    const value = Array.from(e.target.selectedOptions, (option) => {
      return option.value;
    });
    setRooms({
      _id: value[0].split(",")[0],
      title: value[0].split(",")[1],
      price: Number(value[0].split(",")[2]),
      desc: value[0].split(",").splice(3).join(","),
    });
  };

  const handleChangeImage = (e) => {
    setImage(e.target.value);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    setImages((preImages) => [...preImages, image]);
    setImage("");
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    if (images.length > 1) {
      setImages((preImages) => preImages.filter((i) => i !== selectImage));
    } else {
      setImages([]);
    }
  };

  const handleSelectImages = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectImage(value[0]);
  };

  const handleChooseRoom = (e) => {
    e.preventDefault();
    setRoomsChoosed((preRooms) => {
      const check = preRooms.map((r) => r._id).some((id) => id === rooms._id);
      if (check) {
        return preRooms;
      } else {
        return [
          ...preRooms,
          {
            _id: rooms._id,
            title: rooms.title,
            price: rooms.price,
            desc: rooms.desc,
          },
        ];
      }
    });
  };

  const handleSelectRoomChoosed = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectRoom(value[0]);
  };

  const handleRemoveRoomsChoosed = (e) => {
    e.preventDefault();
    if (roomsChoosed.length > 1) {
      setRoomsChoosed((preRooms) =>
        preRooms.filter((r) => r._id !== selectRoom)
      );
    } else {
      setRoomsChoosed([]);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const newhotel = {
      ...info,
      rooms: roomsChoosed.map((r) => r._id),
      photos: images,
    };

    try {
      const res = await axios.put(`/hotels/${params.hotelId}`, newhotel, {
        headers: {
          Authorization: token,
        },
      });
      navigate("/hotels");
    } catch (err) {
      console.log(err);
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
                } else {
                  return (
                    <div className={classes.formInput} key={input.id}>
                      <label>{input.label}</label>
                      <input
                        id={input.id}
                        onChange={handleChange}
                        value={info[input.id] || ""}
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
                <select
                  id="featured"
                  onChange={handleChange}
                  value={info.featured}
                >
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
                      <option key={index} value={room._id}>
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

export default EditHotel;
