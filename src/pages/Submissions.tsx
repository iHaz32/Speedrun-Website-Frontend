import React from "react";
import "../App.css";
import axios from "axios";
import { faBars, faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
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

function Submissions() {
  const [Auth, setAuth] = React.useState("none");
  const [notAuth, setNotAuth] = React.useState("none");
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
        if (res.data.data.User.isAdmin) {
          setAuth("flex");
        } else {
          setNotAuth("flex");
        }
      } catch (err) {
        setNotAuth("flex");
      }
    };
    verify().catch();
  }, []);

  const logout = async (e: any) => {
    await axios.get("http://localhost:8000/auth/logout", {
      withCredentials: true,
    });
  };

  React.useEffect(() => {
    axios.post("http://localhost:8000/submissions", {}).then((res) => {
      setSpeedruns(res.data.data.speedruns);
    });
  }, []);

  const manage = async (option: string, id: string) => {
    await axios
      .post("http://localhost:8000/manage", {
        option: option,
        id: id,
        isAdmin: user?.isAdmin,
      })
      .then((res) => {
        window.location.reload();
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

      <div className="bg-primary text-tertiary flex flex-wrap py-7 px-11 gap-6 h-screen overflow-scroll sm:overflow-auto">
        <div
          className="flex flex-col sm:flex-row gap-2 w-full"
          style={{ display: Auth }}
        >
          <div className="bg-secondary flex flex-col h-auto sm:h-full w-auto px-12 py-6">
            <span className="flex justify-center items-center font-bold text-base sm:text-lg pb-6 w-max">
              Choose action:
            </span>
            <ul>
              <a
                href="/admin/games"
                className="text-blue-600 flex text-sm sm:text-base justify-center hover:text-blue-300 underline underline-offset-2 w-max"
              >
                <li className="list-disc pb-3">Add a game</li>
              </a>
              <a
                href="/admin/submissions"
                className="text-blue-600 flex text-sm sm:text-base justify-center hover:text-blue-300 underline underline-offset-2 w-max"
              >
                <li className="list-disc">Submissions Panel</li>
              </a>
            </ul>
          </div>
          <div className="bg-secondary flex gap-2 flex-col h-full w-full p-5 overflow-y-scroll">
            <span className="pb-4 sm:pb-8 text-base sm:text-lg md:text-xl lg:text-2xl font-medium justify-center text-center">
              Submissions that are awaiting approval:
            </span>
            <div className="flex flex-col text-sm sm:text-base md:text-lg lg:text-xl ">
              {speedruns.map((el) => (
                <div className="flex flex-row items-center py-5">
                  <a
                    href={`http://localhost:3000/speedrun?id=${el._id}`}
                    className="text-blue-600 hover:text-blue-300 underline underline-offset-2"
                  >
                    {el.name}
                  </a>
                  <div className="flex ml-auto gap-4">
                    <button
                      onClick={() => manage("Yes", el._id)}
                      className="bg-[#18DB4C] font-medium p-2 sm:p-4 rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => manage("No", el._id)}
                      className="bg-[#DC2626] font-medium p-2 sm:p-4 rounded"
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <span
          className="flex text-3xl font-medium justify-center items-center text-center"
          style={{ display: notAuth }}
        >
          You are not authorized for this action.
        </span>
      </div>
    </>
  );
}

export default Submissions;
