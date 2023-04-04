import React from "react";
import "../App.css";
import axios from "axios";
import { faBars, faMedal, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "@headlessui/react";
import { Navigate, useNavigate } from "react-router-dom";
import { User } from "../types";
import { Speedrun } from "../types";

const navbar = [
  //5Run
  {
    name: "About",
    href: "/about",
    ml: "",
    loggedOnly: false,
    adminOnly: false,
  },
  {
    name: "Submit",
    href: "/submit",
    ml: "",
    loggedOnly: true,
    adminOnly: false,
  },
  {
    name: "My Submissions",
    href: "/mysubmissions",
    ml: "",
    loggedOnly: true,
    adminOnly: false,
  },
  {
    name: "Admin",
    href: "/admin",
    ml: "",
    loggedOnly: true,
    adminOnly: true,
  },
  {
    name: "Login",
    href: "/login",
    ml: "auto",
    loggedOnly: false,
    adminOnly: false,
  },
  {
    name: "Register",
    href: "/register",
    ml: "",
    loggedOnly: false,
    adminOnly: false,
  },
  //Logout
];

function DisplayingSpeedrun() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User>();
  const [speedrun, setSpeedrun] = React.useState<Speedrun>();
  const [delButton, setDelButton] = React.useState("none");

  React.useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/auth/sessions/verify",
          { withCredentials: true }
        );
        setUser(res.data.data.User ?? undefined);
        if (res.data.data.User.isAdmin) {
          setDelButton("flex");
        }
      } catch (err) {}
    };
    verify().catch();
  }, []);

  const logout = async (e: any) => {
    await axios.get("http://localhost:8000/auth/logout", {
      withCredentials: true,
    });
  };

  React.useEffect(() => {
    axios
      .post("http://localhost:8000/speedrun", {
        url: window.location.href,
      })
      .then((res) => {
        setSpeedrun(res.data.data.speedrun);
      });
  }, []);

  const deleteSpeedrun = async (e: any) => {
    await axios
      .post("http://localhost:8000/delete", {
        isAdmin: user?.isAdmin,
        id: speedrun?._id,
      })
      .then((res) => {
        navigate("/home");
      });
  };

  return (
    <>
      {/*Default Navbar*/}
      <div className="bg-secondary text-tertiary justify-center items-center hidden gap-6 flex-wrap px-10 md:flex">
        <a href="/home" className="text-xl">
          <FontAwesomeIcon icon={faMedal} size="xl" />
          <span className="text-xl font-medium align-text-top px-1 py-5">
            5Run
          </span>
        </a>

        {user !== undefined ? (
          <>
            {navbar
              .filter(
                (el) =>
                  (user.isAdmin ? true : !el.adminOnly) &&
                  el.name !== "5Run" &&
                  el.name !== "Register" &&
                  el.name !== "Login"
              )
              .map((el) => (
                <a
                  href={el.href}
                  className="hover:bg-[#2D302D] hover:font-medium py-5 px-1"
                  style={{ marginLeft: el.ml }}
                >
                  {el.name}
                </a>
              ))}
            <a
              href="/home"
              className="hover:bg-[#2D302D] hover:font-medium py-5 px-1 ml-auto"
              onClick={(e) => logout(e)}
            >
              Logout
            </a>
          </>
        ) : (
          <>
            {navbar
              .filter((el) => el.loggedOnly === false)
              .map((el) => (
                <a
                  href={el.href}
                  className="hover:bg-[#2D302D] hover:font-medium py-5 px-1"
                  style={{ marginLeft: el.ml }}
                >
                  {el.name}
                </a>
              ))}
          </>
        )}
      </div>

      {/*Navbar for small screens*/}
      <div className="bg-secondary text-tertiary justify-center items-center w-full visible py-5 px-10 md:hidden">
        <>
          <a href="/home" className="text-xl">
            <FontAwesomeIcon icon={faMedal} size="xl" />
            <span className="text-xl font-medium align-text-top px-1 py-5">
              5Run
            </span>
          </a>
          <Menu>
            <Menu.Button className="absolute right-5 top-6 ml-auto">
              <FontAwesomeIcon icon={faBars} />
            </Menu.Button>
            <Menu.Items className="absolute right-9 top-7 bottom-0 w-44 h-min rounded-md bg-[#2D302D] shadow-lg">
              <Menu.Item>
                {({ active }) => (
                  <div className="flex flex-col px-5 py-2 gap-2 text-sm font-semibold">
                    {user !== undefined ? (
                      <>
                        {navbar
                          .filter(
                            (el) =>
                              (user.isAdmin ? true : !el.adminOnly) &&
                              el.name !== "5Run" &&
                              el.name !== "Register" &&
                              el.name !== "Login"
                          )
                          .map((el) => (
                            <a href={el.href}>{el.name}</a>
                          ))}
                        <a href="/home" onClick={(e) => logout(e)}>
                          Logout
                        </a>
                      </>
                    ) : (
                      <>
                        {navbar
                          .filter((el) => el.loggedOnly === false)
                          .map((el) => (
                            <a href={el.href}>{el.name}</a>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </>
      </div>

      <div className="bg-primary text-tertiary justify-center items-center flex flex-wrap py-7 px-11 gap-6 h-screen">
        {speedrun && (speedrun.status === "approved" || user!.isAdmin) ? (
          <div className="bg-secondary w-full rounded-3xl shadow-2xl">
            <div className="flex flex-row justify-center items-center py-4 gap-4">
              <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
                {speedrun.name}
              </span>
              <button
                className="bg-[#DC2626] h-min p-2 rounded-lg text-[10px] sm:text-base hover:bg-[#a53b31]"
                style={{ display: delButton }}
                onClick={(e) => deleteSpeedrun(e)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="flex flex-col py-4 items-center">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                Author:
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">
                {speedrun.author}
              </span>
            </div>
            <div className="flex flex-col py-4 items-center">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                Game:
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">
                {speedrun.game}
              </span>
            </div>
            <div className="flex flex-col py-4 items-center text-center">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                Video:
              </span>
              <a
                href={speedrun.url}
                className="text-blue-600 hover:text-blue-300 underline underline-offset-2 text-xs sm:text-sm md:text-base lg:text-lg"
              >
                {speedrun.url}
              </a>
            </div>
            <div className="flex flex-col py-4 items-center">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                Exploits game bugs:
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">
                {speedrun.bugs}
              </span>
            </div>
            <div className="flex flex-col py-4 items-center">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                Date added:
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">
                {speedrun.date}
              </span>
            </div>
            <div className="flex flex-col py-4 items-center">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                Status:
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm lg:text-base">
                {speedrun.status}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
            This speedrun does not exist or has been removed.
          </div>
        )}
      </div>
    </>
  );
}

export default DisplayingSpeedrun;
