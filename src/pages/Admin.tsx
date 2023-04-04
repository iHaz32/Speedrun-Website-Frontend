import React from "react";
import "../App.css";
import axios from "axios";
import { faBars, faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "@headlessui/react";
import { User } from "../types";

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

function Admin() {
  const [Auth, setAuth] = React.useState("none");
  const [notAuth, setNotAuth] = React.useState("none");
  const [user, setUser] = React.useState<User>();

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
          <div className="bg-secondary flex justify-center items-center gap-2 flex-col h-full w-full">
            <>
              <span className="flex text-lg sm:text-3xl font-bold text-center">
                Welcome to the admin panel!
              </span>
              <span className="flex text-sm sm:text-xl font-medium opacity-90 text-center">
                Click a task to manage from the bar on left.
              </span>
            </>
          </div>
        </div>
        <span
          className="text-3xl font-medium justify-center items-center"
          style={{ display: notAuth }}
        >
          You are not authorized for this action.
        </span>
      </div>
    </>
  );
}

export default Admin;
