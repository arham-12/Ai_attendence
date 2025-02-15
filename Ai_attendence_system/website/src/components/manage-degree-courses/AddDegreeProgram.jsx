import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import Loader from "../Loader";
import toast from "react-hot-toast";

const AddDegreeProgram = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { authToken } = useContext(AuthContext);
  console.log(authToken);

  const [matchedDegrees, setmatchedDegrees] = useState([]);
  console.log(matchedDegrees);

  const [loading, setloading] = useState(false);
  const [query, setquery] = useState("");
  const SearchAvailablePrograms = async (e) => {
    setloading(true);
    setquery(e.target.value);
    try {
      const res = await axios.get(`${apiUrl}/api/program-suggestion/`, {
        params: { query },
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      if (res) {
        setmatchedDegrees(res.data.sugessted_degrees);
        setloading(false);
        console.log(res);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  const AddDegree = async (term) => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/degree-programs/`,
        {
          program_name: term,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      if (res.status == "201") {
        toast.success("Added Successfully!");
      }
      if (res.status == "400") {
        toast.error("Already Added");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      console.log(error.message);
    }
  };
  return (
    <div className="w-full mx-auto px-10">
      <form class="mx-auto flex items-start justify-between mt-4">
        <div className="w-[85%]">
          <input
            type="text"
            value={query}
            onChange={SearchAvailablePrograms}
            placeholder="Enter Degree Program"
            class="px-4 py-2.5 bg-gray-200 w-full text-sm outline-none rounded transition-all"
          />
          {loading && <Loader />}
          <div className={`${matchedDegrees ? "block" : "hidden"}`}>
            <ul>
              {Array.isArray(matchedDegrees) &&
                matchedDegrees.map((term) => {
                  return (
                    <li className="w-full flex justify-between items-center p-2 ">
                      <p>{term}</p>
                      <button
                        type="button"
                        onClick={() => AddDegree(term)}
                        class="px-6 py-1.5 text-sm font-medium bg-primary hover:bg-[#222] text-white rounded"
                      >
                        Add
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={() => AddDegree(query)}
          class="px-6 py-2.5 text-sm font-medium bg-primary hover:bg-[#222] text-white rounded"
        >
          Add Program
        </button>
      </form>
    </div>
  );
};

export default AddDegreeProgram;
