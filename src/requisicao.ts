
export default async function requisicao(id: string,token: string) {
  const res = await fetch(`
https://api.spotify.com/v1/playlists/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro:", res.status, error);
    return;
  }

  const data = await res.json();
  return(
    data.tracks.items.map((item: any) => (item))

  )
}

