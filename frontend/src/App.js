import React from "react";
import {
  useCreateMutation,
  useDeleteByIdMutation,
  useGetAllQuery,
  useGetByIdQuery,
  useUpdByIdMutation,
} from "./store/slices/todosCrud";

const App = () => {
  const { data } = useGetAllQuery();
  // const { data: byId } = useGetByIdQuery(51);
  const [update, result] = useUpdByIdMutation();
  const [add, addRes] = useCreateMutation();
  const [dlt, dltRes] = useDeleteByIdMutation();

  console.log("RTK =====", data);
  return (
    <button
      style={{
        backgroundColor: "#aaa",
        height: 55,
        width: 150,
      }}
      onClick={() => update({
        id:57, data:{
          title:"RTK CRUD AGAIN 123"
        }
      })}>
      update
    </button>
  );
};

export default App;
