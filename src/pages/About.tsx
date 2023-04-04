import React from "react";
import "../App.css";
import axios from "axios";
import {
  faBars,
  faMedal,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
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

function About() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/auth/sessions/verify",
          { withCredentials: true }
        );
        setUser(res.data.data.User ?? undefined);
      } catch (err) {}
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

      <div className="bg-primary text-tertiary justify-center items-center flex flex-wrap py-7 px-11 gap-6 h-screen overflow-scroll sm:overflow-auto">
        <div className="bg-secondary flex flex-col flex-wrap px-5 rounded-xl shadow-xl">
          <div className="flex flex-row justify-center items-center">
            <FontAwesomeIcon
              icon={faPersonRunning}
              className="flex text-xl sm:text-4xl px-1"
            />
            <span className="flex justify-center items-center pt-2 pb-4 text-lg sm:text-3xl font-bold">
              What is speedrunning?
            </span>
            <FontAwesomeIcon
              icon={faPersonRunning}
              className="flex text-xl sm:text-4xl px-1"
            />
          </div>
          <span className="flex justify-center items-center pb-8 text-xs sm:text-lg font-medium">
            A speedrun is a playthrough of a video game, or section of a video
            game, with the goal of completing it as fast as possible. Speedruns
            often follow planned routes, which may incorporate sequence breaking
            and can exploit glitches that allow sections to be skipped or
            completed more quickly than intended. Tool-assisted speedruns (TAS)
            are a subset of speedruns that may use emulation software to slow
            the game down and create a controlled sequence of inputs with
            greater precision than a non-TAS run. The purpose of 5Run is to
            share videos of speedrunning via the internet.
          </span>
          <div className="flex flex-row justify-center items-center">
            <FontAwesomeIcon
              icon={faPersonRunning}
              className="flex text-xl sm:text-4xl px-1"
            />
            <span className="flex justify-center items-center pt-2 pb-4 text-lg sm:text-3xl font-bold">
              History of Speedrunning
            </span>
            <FontAwesomeIcon
              icon={faPersonRunning}
              className="flex text-xl sm:text-4xl px-1"
            />
          </div>
          <span className="flex justify-center items-center pb-2 text-xs sm:text-lg font-medium">
            Speedrunning has been generally an intrinsic part of video games
            since early games, similar to chasing of high scores. However, broad
            interest in speedrunning came about with the wider availability of
            the Internet around 1993 that gave the means for players to be able
            to share their speedruns with online communities. Sites dedicated to
            speedrunning, including game-specific sites, began to appear at the
            same time and helped to create the subculture around speedrunning.
            These sites not were only used for sharing runs, but also to
            collaborate and share tips to improve times, leading to
            collaborative efforts to continuously improve speedrunning records
            on certain games. 5Run is one of these sites.
          </span>
        </div>
      </div>
    </>
  );
}

export default About;
