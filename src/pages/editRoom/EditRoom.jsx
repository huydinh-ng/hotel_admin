import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./editRoom.module.css";

const EditRoom = () => {
  const { roomId } = useParams();
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const token = Cookies.get("access_token");
  const [isErr, setIsErr] = useState(false);
  const { data } = useFetch("/hotels");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios(`/rooms/${roomId}`, {
          headers: {
            Authorization: token,
          },
        });
        setInfo({
          title: res.data.title,
          desc: res.data.desc,
          price: res.data.price,
          maxPeople: res.data.maxPeople,
        });
        setRooms(res.data.roomNumbers.join(","));
        console.log(res.data.roomNumbers.join(","));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

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
    const roomNumbers = rooms.split(",").map((room) => [Number(room)]);
    try {
      await axios.put(
        `/rooms/${roomId}`,
        { ...info, roomNumbers },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      navigate("/rooms");
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  };

  const hotelName = data.find((d) =>
    d.rooms.some((r) => r._id === roomId)
  )?.name;

  return (
    <div className={classes.new}>
      <Sidebar />
      <div className={classes.newContainer}>
        <div className={classes.top}>
          <h1>Edit Room</h1>
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
                    value={info[input.id] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className={classes.formInput}>
                <label>Rooms</label>
                <textarea
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                />
              </div>
              {hotelName && (
                <div className={classes.formInput}>
                  <label>Room's hotel (ReadOnly)</label>
                  <input type="text" value={hotelName} readOnly />
                </div>
              )}
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

export default EditRoom;
