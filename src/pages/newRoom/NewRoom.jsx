import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import classes from "./newRoom.module.css";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const token = Cookies.get("access_token");
  const [isErr, setIsErr] = useState(false);
  const { data, loading } = useFetch("/hotels");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setIsErr(false);
    if (e.target.id === "price" || e.target.id === "maxPeople") {
      setInfo((prev) => ({ ...prev, [e.target.id]: Number(e.target.value) }));
    } else {
      setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (rooms.length < 1) {
      setIsErr(true);
    } else {
      const roomNumbers = rooms?.split(",").map((room) => [Number(room)]);
      console.log(roomNumbers);
      try {
        if (!hotelId) {
          await axios.post(
            "/rooms/new",
            { ...info, roomNumbers },
            {
              headers: {
                Authorization: token,
              },
            }
          );
        } else {
          await axios.post(
            `/rooms/${hotelId}`,
            { ...info, roomNumbers },
            {
              headers: {
                Authorization: token,
              },
            }
          );
        }
        navigate("/rooms");
      } catch (err) {
        setIsErr(true);
        console.log(err);
      }
    }
  };

  return (
    <div className={classes.new}>
      <Sidebar />
      <div className={classes.newContainer}>
        <div className={classes.top}>
          <h1>Add New Room</h1>
        </div>
        <div className={classes.bottom}>
          <div className={classes.right}>
            <form>
              {roomInputs.map((input) => (
                <div className={classes.formInput} key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className={classes.formInput}>
                <label>Rooms</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                />
              </div>
              <div className={classes.formInput}>
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  {loading ? (
                    <option value={""}>
                      No hotels yet, just adding new rooms
                    </option>
                  ) : (
                    data &&
                    data.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))
                  )}
                </select>
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

export default NewRoom;
