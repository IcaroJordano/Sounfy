const getDataTrack = async (trackId: string, token: string) => {
  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro:", res.status, error, res);
    return;
  }

  const data = await res.json();
  return data;
};

const getGenresTrackByArtist = async (artistId: string, token: string) => {
  const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro:", res.status, error, res);
    return;
  }

  const data = await res.json();
  return data;
};

const getTracksByArtist = async (artistId: string, token: string) => {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=BR`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro:", res.status, error, res);
    return;
  }

  const data = await res.json();
  return data;
};

// const getFeaturesByTrack = async (trackId: string, token: string) => {
//   const res = await fetch(
//     `https://api.spotify.com/v1/audio-features/${trackId}`
//     , {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const error = await res.text();
//         console.error("Erro:", res.status, error, res);
//         return;
//       }

//       const data = await res.json();
//       return(
//         (data)
//       )
// }

const getPlaylistPublic = async (genre: string, token: string) => {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=genre:${genre}&type=playlist`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    const error = await res.text();
    console.error("Erro:", res.status, error, res);
    return;
  }

  const data = await res.json();
  console.log(data);
  if (data.playlists.items.length === 0) {
    return [];
  }

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${data.playlists.items[0].id}/tracks?limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Erro:", response.status, error, response);
    return;
  }

  const data1 = await response.json();
  const names = data1.items.map((item: any) => item.track);

  return names;
};

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // troca os elementos
  }
  return array;
}

export default async function recomendacao(trackId: string, token: string) {
  let recomendacoes: Array<string> = [];
  // console.log(`https://api.spotify.com/v1/audio-features/${trackId}`,)
  // const features = await getFeaturesByTrack(trackId, token)
  // console.log(features);
  const { artists } = await getDataTrack(trackId, token);
  const { genres } = await getGenresTrackByArtist(artists[0].id, token);
  // console.log(genres)
  let data1 = await getPlaylistPublic(genres[0], token);

  if (data1.length === 0) {
    data1 = await getPlaylistPublic(genres[1], token);
    if (data1.length === 0) {
      data1 = await getPlaylistPublic(genres[2], token);
    }
  }
  console.log(data1);

  const data = await getTracksByArtist(artists[0].id, token);

  recomendacoes = [...data.tracks, ...data1];
  console.log(recomendacoes);
  return shuffleArray(recomendacoes).map((item: any) => item);
}
