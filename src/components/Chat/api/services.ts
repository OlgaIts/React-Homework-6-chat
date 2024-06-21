import {Message} from "../Chat";

const url = "http://localhost:7070/messages/";

export const getMessages = async (id: number) => {
  try {
    const response = await fetch(`${url}?from=${id}`);
    if (response.status === 200) {
      const result: Message[] = await response.json();
      return {
        status: "success",
        data: result,
      };
    }
    return {
      status: "error",
      errorMessage: "" // обработка 400, 500 
    };
  } catch (error) {
    return {
      status: "error", // когда сервер в отключке
    }
  }
};

export const postMessage = async (
  id: number,
  userId: string,
  content: string,
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      id,
      userId,
      content,
    }),
  });
  if (response.status === 204) {
    return "success";
  }

  return "error";
};
