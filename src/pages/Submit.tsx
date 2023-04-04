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

function Submit() {
  const navigate = useNavigate();
  const [buttonMsg, setButtonMsg] = React.useState("");
  const [user, setUser] = React.useState<User>();
  const [games, setGames] = React.useState<Array<Games>>([]);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(games[0]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/auth/sessions/verify",
          { withCredentials: true }
        );
        setUser(res.data.data.User ?? undefined);
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

  React.useEffect(() => {
    axios.get("http://localhost:8000/loadGames").then((res) => {
      setGames(res.data.data.games);
    });
  }, []);

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

  const submit = async (e: any) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:8000/submitSpeedrun",
        {
          name: e.target[0].value,
          game: e.target[1].value,
          url: e.target[2].value,
          checked: e.target[3].checked,
          username: user?.username,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setButtonMsg(res.data.msg);
        setIsOpen(true);
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
        <form onSubmit={(e) => submit(e)}>
          <div className="bg-secondary flex flex-col rounded-md h-auto w-auto p-5">
            <span className="flex justify-center items-center font-bold text-2xl pb-1">
              Upload a speedrun!
            </span>
            <hr className="w-full" />
            <span className="flex pt-2">Speedrun Name:</span>
            <input
              type="text"
              className="bg-white text-black px-1 w-auto sm:w-80"
              required
            ></input>
            <span className="flex pt-4">Game name:</span>
            <Combobox value={selected} onChange={setSelected}>
              <Combobox.Input
                onChange={(event) => setQuery(event.target.value)}
                className="flex text-black"
                required
              />
              <Combobox.Options className="flex flex-col h-32 overflow-auto bg-[#464B4A]">
                {filteredGames.map((game) => (
                  <Combobox.Button>
                    <div className="flex border border-secondary">
                      <Combobox.Option key={game._id} value={game.name}>
                        {wordForm(game.name)}
                      </Combobox.Option>
                    </div>
                  </Combobox.Button>
                ))}
              </Combobox.Options>
            </Combobox>
            <span className="flex pt-4">Video URL:</span>
            <input
              type="text"
              className="bg-white text-black px-1 w-auto sm:w-80"
              required
            ></input>
            <div className="flex flex-row pt-4">
              <span>Bugs are used:</span>
              <input type="checkbox" className="ml-2"></input>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary rounded-lg hover:font-medium w-min h-min p-2 mt-3"
              >
                Upload
              </button>
            </div>
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={(e) => setIsOpen(false)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {buttonMsg[0]}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {buttonMsg[1]}
                          </p>
                        </div>

                        <div className="mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#095010] px-4 py-2 text-sm font-medium text-white hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            onClick={(e) => setIsOpen(false)}
                          >
                            Okay!
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        </form>
      </div>
    </>
  );
}

export default Submit;
