import React from "react";
import "../App.css";
import axios from "axios";
import {
  faBars,
  faMedal,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox, Transition, Dialog } from "@headlessui/react";
import { Menu } from "@headlessui/react";
import { User } from "../types";
import { Games } from "../types";
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

function Home() {
  const [user, setUser] = React.useState<User>();
  const [speedruns, setSpeedruns] = React.useState<Array<Speedrun>>([]);
  const [games, setGames] = React.useState<Array<Games>>([]);
  const [query, setQuery] = React.useState("");

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

  React.useEffect(() => {
    axios.get("http://localhost:8000/loadSpeedruns").then((res) => {
      setSpeedruns(res.data.data.speedruns);
    });
  }, []);

  React.useEffect(() => {
    axios.get("http://localhost:8000/loadGames").then((res) => {
      setGames(res.data.data.games);
    });
  }, []);

  const search = async (e: any) => {
    e.preventDefault();
    const input = e.target[0].value;
    axios
      .post("http://localhost:8000/loadSearch", {
        speedruns: speedruns,
        input: input,
      })
      .then((res) => {
        setSpeedruns(res.data.data.newSpeedruns);
      });
  };

  const loadFilters = async (e: any, type: string) => {
    e.preventDefault();
    document.getElementById("menu")!.style.display = "none";
    const value = type !== "author" ? e.target.innerHTML : e.target[0].value;
    axios
      .post("http://localhost:8000/loadFilters", {
        speedruns: speedruns,
        type: type,
        value: value,
      })
      .then((res) => {
        setSpeedruns(res.data.data.newSpeedruns);
      });
  };

  const filteredGames =
    query === ""
      ? games
      : games.filter((game) => {
          return game.name.toLowerCase().includes(query.toLowerCase());
        });

  const wordForm = (name: string) => {
    const words = name.split(" ");

    const formattedWord = words
      .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
      .join(" ");
    return formattedWord;
  };

  return (
    <div className="h-full bg-primary">
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

      <div className="bg-primary text-tertiary flex flex-col py-7 px-11 gap-6 h-full">
        <div className="bg-secondary rounded-3xl justify-center flex flex-row h-min w-full  p-4">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-lg font-bold">
              Do you want to submit your own speedrun?
            </span>
            <span className="text-[8px] sm:text-base">
              In order to submit your own speedrun, you need to be logged in and
              visit submit page from the navigation bar. If you do not have your
              account, then you can{" "}
              <a href="/register" className="underline underline-offset-4">
                register
              </a>{" "}
              one for free.
            </span>
          </div>
        </div>

        <div
          className="bg-secondary rounded-3xl shadow-2xl w-full"
          style={{ minHeight: "500px" }}
        >
          <div className="flex flex-row justify-center items-center h-8 sm:h-16 p-2 gap-2">
            <form
              className="flex flex-row w-full gap-2"
              onSubmit={(e) => {
                search(e);
              }}
            >
              <input
                type="search"
                id="default-search"
                className="block w-full pl-2 sm:p-2 rounded-t-xl bg-[#2D302D] border border-[#464B4A] text-[9px] sm:text-base"
                placeholder="Search speedrun..."
                required
              ></input>
              <button
                type="submit"
                className="bg-[#2D302D] text-[8px] sm:text-base font-medium rounded-xl p-2"
              >
                SEARCH
              </button>
            </form>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="bg-[#2D302D] text-[8px] sm:text-sm font-medium rounded-xl"
            >
              Clear filters
            </button>
          </div>
          <hr className="pb-4" />
          <table className="w-full">
            <tr className="text-[8px] sm:text-xs md:text-sm lg:text-base text-left">
              <th className="text-white pb-6 font-medium whitespace-nowrap sm:px-10">
                Name
                <Menu>
                  <Menu.Button>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className="pl-1 sm:pl-2"
                    />
                  </Menu.Button>

                  <Menu.Items className="absolute w-10 sm:w-16 text-[10px] sm:text-base rounded-md bg-[#2D302D] shadow-lg">
                    <div id="menu">
                      <button
                        className="flex w-full justify-center border border-[#464B4A]"
                        onClick={(e) => {
                          loadFilters(e, "name");
                        }}
                      >
                        (A-Z)
                      </button>
                      <button
                        className="flex w-full justify-center border border-[#464B4A]"
                        onClick={(e) => {
                          loadFilters(e, "name");
                        }}
                      >
                        (Z-A)
                      </button>
                    </div>
                  </Menu.Items>
                </Menu>
              </th>
              <th className="text-white font-medium pb-6 whitespace-nowrap">
                Game
                <Menu>
                  <Menu.Button>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className="sm:pl-1 ml-1"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute w-32 sm:w-56 rounded-md bg-[#2D302D] shadow-lg">
                    <div id="menu">
                      <Combobox>
                        <span className="flex justify-center text-xs sm:text-base">
                          Search a game:
                        </span>
                        <Combobox.Input
                          onChange={(event) => setQuery(event.target.value)}
                          className="flex text-white text-sm w-full bg-primary"
                          placeholder="Search..."
                        />
                        <Combobox.Options className="flex flex-col h-32 overflow-auto bg-[#464B4A]">
                          {filteredGames.map((game) => (
                            <Combobox.Button>
                              <div className="flex w-full text-[10px] sm:text-sm border border-secondary">
                                <Combobox.Option
                                  key={game._id}
                                  value={game.name}
                                >
                                  <button
                                    className="flex text-start"
                                    onClick={(e) => {
                                      loadFilters(e, "game");
                                    }}
                                  >
                                    {wordForm(game.name)}
                                  </button>
                                </Combobox.Option>
                              </div>
                            </Combobox.Button>
                          ))}
                        </Combobox.Options>
                      </Combobox>
                    </div>
                  </Menu.Items>
                </Menu>
              </th>
              <th className="text-white font-medium pb-6 pr-3 whitespace-nowrap">
                Bugs
                <Menu>
                  <Menu.Button>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className="sm:pl-1 ml-1"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute w-10 sm:w-16 text-[10px] sm:text-base rounded-md bg-[#2D302D] shadow-lg">
                    <div id="menu">
                      <button
                        className="flex w-full justify-center border border-[#464B4A]"
                        onClick={(e) => {
                          loadFilters(e, "bugs");
                        }}
                      >
                        Yes
                      </button>
                      <button
                        className="flex w-full justify-center border border-[#464B4A]"
                        onClick={(e) => {
                          loadFilters(e, "bugs");
                        }}
                      >
                        No
                      </button>
                    </div>
                  </Menu.Items>
                </Menu>
              </th>
              <th className="text-white font-medium pb-6 pr-3 whitespace-nowrap">
                Author
                <Menu>
                  <Menu.Button>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className="sm:pl-1 ml-1"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute">
                    <form
                      onSubmit={(e) => {
                        loadFilters(e, "author");
                      }}
                    >
                      <div
                        id="menu"
                        className="absolute rounded-md bg-[#2D302D] shadow-lg w-20 sm:w-48"
                      >
                        <span className="flex justify-center text-xs sm:text-base">
                          Search a user:
                        </span>
                        <input
                          className="flex w-full bg-primary h-5 text-sm"
                          placeholder="Search..."
                        ></input>
                        <div className="flex justify-center p-1">
                          <button
                            className="flex bg-secondary px-1 rounded-lg text-xs sm:text-base"
                            type="submit"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </form>
                  </Menu.Items>
                </Menu>
              </th>
              <th className="text-white font-medium pb-6 sm:pr-4 whitespace-nowrap">
                Date
                <Menu>
                  <Menu.Button>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className="sm:pl-1 ml-1"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute w-10 sm:w-16 text-[10px] sm:text-base rounded-md bg-[#2D302D] shadow-lg">
                    <div id="menu">
                      <button
                        className="flex w-full justify-center border border-[#464B4A]"
                        onClick={(e) => {
                          loadFilters(e, "date");
                        }}
                      >
                        Newer
                      </button>
                      <button
                        className="flex w-full justify-center border border-[#464B4A]"
                        onClick={(e) => {
                          loadFilters(e, "date");
                        }}
                      >
                        Older
                      </button>
                    </div>
                  </Menu.Items>
                </Menu>
              </th>
            </tr>
            {speedruns.map((el) => (
              <tr className="text-[6px] sm:text-[10px] md:text-xs lg:text-sm">
                <td className="pb-4 sm:px-10 text-blue-600 hover:text-blue-300 underline underline-offset-2">
                  <a href={`http://localhost:3000/speedrun?id=${el._id}`}>
                    {el.name}
                  </a>
                </td>
                <td className="pb-4">{el.game}</td>
                <td className="pb-4">{el.bugs}</td>
                <td className="pb-4">{el.author}</td>
                <td className="pb-4">{el.date}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
