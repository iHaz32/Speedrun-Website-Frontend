import React from "react";
import "../App.css";
import axios from "axios";
import { faBars, faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import { Games } from "../types";
import { Combobox, Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
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

function MySubmissions() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User>();
  const [speedruns, setSpeedruns] = React.useState<Array<Speedrun>>([]);

  React.useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/auth/sessions/verify",
          { withCredentials: true }
        );
        setUser(res.data.data.User ?? undefined);
        axios
          .post("http://localhost:8000/mySubmissions", {
            author: res.data.data.User,
          })
          .then((res) => {
            setSpeedruns(res.data.data.speedruns);
          });
      } catch (err) {
        navigate("/login");
      }
    };
    verify().catch();
  }, []);

  const logout = async (e: any) => {
    await axios.get("http://localhost:8000/auth/logout", {
      withCredentials: true,
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

      <div className="bg-primary text-tertiary items-center flex flex-col gap-10 py-7 px-11 h-screen overflow-scroll sm:overflow-auto">
        <div className="bg-secondary w-full rounded-3xl shadow-2xl overflow-y-scroll">
          <div className="flex flex-col items-center h-44">
            <span className="pb-2 text-base sm:text-lg md:text-xl lg:text-2xl">
              Awaiting approval
            </span>
            <ul className="text-[10px] sm:text-sm md:text-base lg:text-lg">
              {speedruns
                .filter((el) => el.status === "awaiting")
                .map((el) => (
                  <li className="list-disc">{el.name}</li>
                ))}
            </ul>
          </div>
        </div>
        <div className="bg-secondary w-full rounded-3xl shadow-2xl overflow-y-scroll">
          <div className="flex flex-col items-center h-44">
            <span className="pb-2 text-base sm:text-lg md:text-xl lg:text-2xl">
              Approved
            </span>
            <ul className="text-[10px] sm:text-sm md:text-base lg:text-lg">
              {speedruns
                .filter((el) => el.status === "approved")
                .map((el) => (
                  <a
                    href={`http://localhost:3000/speedrun?id=${el._id}`}
                    className="text-blue-600 hover:text-blue-300 underline underline-offset-2"
                  >
                    <li className="list-disc">{el.name}</li>
                  </a>
                ))}
            </ul>
          </div>
        </div>
        <div className="bg-secondary w-full rounded-3xl shadow-2xl overflow-y-scroll">
          <div className="flex flex-col items-center h-44">
            <span className="pb-2 text-base sm:text-lg md:text-xl lg:text-2xl">
              Rejected
            </span>
            <ul className="text-[10px] sm:text-sm md:text-base lg:text-lg">
              {speedruns
                .filter((el) => el.status === "rejected")
                .map((el) => (
                  <li className="list-disc">{el.name}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default MySubmissions;
