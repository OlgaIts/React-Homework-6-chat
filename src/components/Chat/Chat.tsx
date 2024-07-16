import {FormEvent, useEffect, useState} from "react";
import {getMessages, postMessage} from "./api/services";
import {v4 as uuidv4} from "uuid";
import arrow from "../../assets/arrow.png";
import styles from "./Chat.module.scss";

export interface Message {
  id: number;
  userId: string;
  content: string;
}

const createUser = () => {
  const newId = uuidv4();
  localStorage.setItem("userId", newId);
  return newId;
};

export const Chat = () => {
  const [form, setForm] = useState({content: ""});
  const [list, setList] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const currentUserId = localStorage.getItem("userId") || createUser();

  useEffect(() => {
    const interval = setInterval(async () => {
      const id = (list.length > 0 && list.pop()?.id) || 0; // айди последнего элемента, либо 0
      const response = await getMessages(id);
      if (response.status === "error") {
        setError("Чат недоступен");
        return;
      }
      if (response.data) {
        setList(response.data);
      }
    }, 2 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFormValueChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = target;
    setForm((prevForm) => ({...prevForm, [id]: value}));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lastId = list.pop()?.id;
    const id = lastId ? lastId + 1 : 0;
    const response = await postMessage(id, currentUserId, form.content);
    if (response === "success") {
      setForm({content: ""});
    }
  };

  return (
    <div className={styles.chat}>
      {error && <div className={styles.error}>{error}</div>}
      {list.map((message) => (
        <div
          key={message.id}
          className={
            message.userId === currentUserId ? styles.question : styles.answer
          }
        >
          {message.content}
        </div>
      ))}
      <form action='' className={styles.form} onSubmit={handleSubmit}>
        <input
          value={form.content}
          type='text'
          id='content'
          className={styles.input}
          onChange={handleFormValueChange}
        />
        <button className={styles.btn}>
          <img src={arrow} className={styles.img} />
        </button>
      </form>
    </div>
  );
};
