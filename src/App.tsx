import { useEffect, useState } from "react";
import requisicao from "./requisicao";

import gerarToken from "./gerarToken";

import TimeLine from "./components/TimeLine.tsx";

import recomendacao from "./recomendacao.ts";
import AlertError from "./components/AlertError.tsx";
import { BiPlus, BiPlusCircle } from "react-icons/bi";
import { TbSquareLetterEFilled } from "react-icons/tb";
import ModalConfirmation from "./components/ModalConfirmation.tsx";

interface Music {
  id: string;
  title: string;
  artirst: string;
  image: string;
  link: string;
}

function App() {
  const [musicas, setMusicas] = useState<Music[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let url = formData.get("url") as string;

    if (!url.includes('https://open.spotify.com/track/')) {
      setIsError(true);
      return;
    }

    url = url.replace('https://open.spotify.com/track/', '');

    const preToken = localStorage.getItem("token");

    const token = JSON.parse(preToken!);

    const trackId =
      "4RBXT4PVOHwGpSyT7AbobK?si=yDoG3YBhR4a8qvrFBH_jZQ&pi=juOyGXkISOWjt";
    // recomendacao(url == "" ? trackId : url, token)
    getData(url == "" ? trackId : url, token);
  };

  const getData = async (trackId: string, token: string) => {
    setMusicas([]);
    console.log("getData");
    recomendacao(trackId, token)
      .then((data) => {
        console.log("foi");
        // console.log(data);
        const novasMusicas = data.map((item: any) => ({
          id: item.id,
          title: item.name,
          artirst: item.artists[0].name,
          image: item.album.images[0].url,
          link: item.album.external_urls.spotify,
        }));

        setMusicas((prev) => [...prev, ...novasMusicas]);
        // setMusicas(data);
      })
      .catch(async (error) => {
        console.log("erro na requisicao");

        if (error.status === 401) {
          const novoToken = await gerarToken();
          console.log("novo token");

          localStorage.setItem("token", JSON.stringify(novoToken));
          console.log("salvou token");

          getData(trackId, novoToken!);
        }
        console.error("Erro na requisição:", error);
      });
  };

  // useEffect(() => {
  //   console.log(musicas);
  // }, [musicas]);

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const novoToken = await gerarToken();
  //     localStorage.setItem("token", JSON.stringify(novoToken));
  //     console.log("tokenGerado");
  //   };

  //   fetchToken();
  // }, []);

  return (
    <>
      <ModalConfirmation isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => setIsOpen(false)} />  
      {isError && <AlertError isError={isError} setIsError={setIsError} mesage={"Link Invalido! Tente Novamente"} />}
      <div className="lg:p-3 lg:pt-6 z-10  bg-neutral-800 ">
        <div className="lg:rounded-lg flex flex-col justify-center text-neutral-400  bg-neutral-900  ">
          <div className="text-center">
            <h1 className="text-4xl pt-11 font-bold text-white">
              <span className="text-green-500">Soundfy</span> Social
            </h1>
            <p className="my-4  px-6 lg:px-0 mx-auto">
              Descubra e avalie recomendações de músicas de forma rápida e
              social
            </p>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              className="flex  border w-11/12 lg:w-4/12 my-8 lg:my-0 mb-4 justify-between mx-auto p-1 rounded-xl  "
            >
              <input
                className=" text-neutral-100 px-2 rounded-lg py-2 w-11/12 lg:px-2 text-sm border-none focus:outline-none "
                id="url"
                name="url"
                placeholder="Cole o link da música do Spotify"
                type="text"
              />
              <button
                type="submit"
                className="bg-green-500 text-neutral-100 rounded-lg py-1 px-3 text-sm"
              >
                Explorar{" "}
              </button>
            </form>
            <label className="text-xs my-4  pt-8" htmlFor="url">
              Ex:  https://open.spotify.com/track/7dKz6xy1ZMywmrrP5HMw8u?si=_FhRDMk-Q_Wl1OnRJ4d75w
            </label>
          </div>


          <div className=" border-y border-neutral-600 my-8 min-h-80">
            {musicas.length == 0 && (
              <div>
                <span className="flex rounded-full bg-green-500 mx-auto items-center text-neutral-100 py-1 px-3 w-14 h-14 text-sm justify-center my-8">
                  <BiPlusCircle size={20} className="mx-auto " />

                </span>
                <p className="text-white text-center text-xl font-semibold">Nenhuma musica para mostrar </p>
                <p className="text-neutral-400 text-center text-sm my-4">Cole o link da músicas do Spotify acima para comecar a explorar</p>
              </div>
            
            )}

            {musicas?.map((musica: Music, index: any) => (
            
            
              <a key={index} href={musica.link} className="flex flex-col gap-y-12  ">
                <div className="flex  justify-between px-4 my-3">
                  <img
                    className="w-12 h-12 rounded-sm "
                    src={musica.image}
                    alt=""
                  />
                  <div className="ps-4 w-10/12">
                    <p className="text-lg line-clamp-1 w-10/12 text-white">
                      {musica.title}
                    </p>
                    <p className="text-sm  text-neutral-400 flex items-center ">
                    <TbSquareLetterEFilled className="mr-1" />
                      {musica.artirst}
                    </p>
                  </div>
                  <div className="rotate-90 text-2xl">...</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

{/* <button onClick={() => setIsOpen(!isOpen)} className="bg-green-500 text-neutral-100 rounded-lg py-1 px-3 text-sm my-4 mx-auto" >Click</button> */}
{/* <button
  onClick={() => {
    const preToken = localStorage.getItem("token");
    const token = JSON.parse(preToken!);
    recomendacao('aa',token)
  }}
  className="bg-green-500 text-neutral-100 rounded-lg py-1 px-3 text-sm my-4 mx-auto"
>
  Recomendar
</button> */}
//   <iframe
            //   src={`https://open.spotify.com/embed/track/${musica.id}`}
            //   width="300"
            //   height="80"
            //   frameBorder="0"
            //   allowTransparency={true}
            //   allow="encrypted-media"
            //   style={{
            //     backgroundColor: 'transparent'
            //   }}
            // ></iframe>

      {/* {isOpen && <TimeLine itens={musicas} />} */}
