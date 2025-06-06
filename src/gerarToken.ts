// Executar com: npx ttsx get-token.ts

// import fetch from "node-fetch";

// const clientId = "759ca19a45c4443e8fb0ef6889481d39";
// const clientSecret = "c82fc9c6f5f44b459125173b061edc68";

export default async function gerarToken(): Promise<string | null> {
  const clientId = "759ca19a45c4443e8fb0ef6889481d39";
  const clientSecret = "c82fc9c6f5f44b459125173b061edc68";

  const authHeader = btoa(`${clientId}:${clientSecret}`); // <-- btoa é nativo do navegador

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Erro ao buscar token:", err);
      return null;
    }

    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error("Erro na requisição do token:", err);
    return null;
  }
}
