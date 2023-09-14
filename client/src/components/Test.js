import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_ALL_GARMENTS = gql`
  query GetAllGarments {
    allGarments {
      id
      brand
      title
      price
      color
      size
      forSale
    }
  }
`;

function Test() {
  const { loading, error, data } = useQuery(GET_ALL_GARMENTS);
  const [garments, setGarments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [originalGarments, setOriginalGarments] = useState([]);
  const [edited, setEdited] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      setGarments(data.allGarments);
      setOriginalGarments(JSON.parse(JSON.stringify(data.allGarments)));
    }
  }, [loading, data]);

  const handleNewChange = (e, id) => {
    const { name, value } = e.target;
    const fieldName = name.split("-")[1];

    const updatedGarments = garments.map((garment) => {
      if (garment.id === id) {
        return { ...garment, [fieldName]: value };
      }
      return garment;
    });

    setGarments(updatedGarments);

    if (!edited.includes(id)) {
      setEdited([...edited, id]);
      const garmentIndex = garments.findIndex((garment) => garment.id === id);
      if (garmentIndex !== -1) {
        const updatedOriginalGarments = [...originalGarments];
        updatedOriginalGarments[garmentIndex] = { ...garments[garmentIndex] };
        setOriginalGarments(updatedOriginalGarments);
      }
    }
  };

  const handleForSaleChange = (e, id) => {
    const newValue = e.target.value === "true";

    const updatedGarments = garments.map((garment) => {
      if (garment.id === id) {
        return { ...garment, forSale: newValue };
      }
      return garment;
    });

    setGarments(updatedGarments);

    if (!edited.includes(id)) {
      setEdited([...edited, id]);

      // Store the original data of the garment
      const garmentIndex = garments.findIndex((garment) => garment.id === id);
      if (garmentIndex !== -1) {
        const updatedOriginalGarments = [...originalGarments];
        updatedOriginalGarments[garmentIndex] = { ...garments[garmentIndex] };
        setOriginalGarments(updatedOriginalGarments);
      }
    }
  };

  const handleSelectChange = (e, id) => {
    if (selected.includes(id)) {
      const newSelected = selected.filter((i) => i !== id);
      setSelected(newSelected);
    } else {
      const newSelected = [...selected, id];
      setSelected(newSelected);
    }
  };

  const newGarment = () => {
    const newRow = {
      id: Date.now() / 100000,
      brand: "",
      title: "",
      price: "",
      color: "",
      size: "",
      forSale: false,
    };

    setGarments([...garments, newRow]);
    setSelected([...selected, newRow.id]);
  };

  const removeSelected = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected rows? This cannot be undone."
    );

    if (!isConfirmed) return;

    const updatedGarments = garments.filter(
      (garment) => !selected.includes(garment.id)
    );

    axios
      .post("/test/deletegarments", { ids: selected })
      .then((response) => {
        console.log("Successfully deleted", response);
        setGarments(updatedGarments);
        setSelected([]);
      })
      .catch((error) => {
        console.log("Delete failed", error);
      });
  };

  const saveChanges = () => {
    let changes = "";

    edited.forEach((id) => {
      const original = originalGarments.find((garment) => garment.id === id);
      const updated = garments.find((garment) => garment.id === id);

      if (!original || !updated) return;

      changes += `Changes for ID ${id}:\n`;

      Object.keys(updated).forEach((key) => {
        if (updated[key] !== original[key]) {
          changes += `  ${key}: ${original[key]} => ${updated[key]}\n`;
        }
      });
    });

    var confirmed = false;
    if (changes) {
      confirmed = window.confirm("Are you sure you want to save?\n" + changes);
    } else {
      alert("No changes made.");
      return;
    }

    if (!confirmed) return;

    const editedGarments = edited.map((id) =>
      garments.find((garment) => garment.id === id)
    );
    axios
      .post("/test/savegarments", { garments: editedGarments })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("API call failed", error);
      });
  };

  const filteredGarments = garments.filter(
    (garment) =>
      garment.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garment.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garment.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garment.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>GARMENTS TABLE</h1>
      <input
        type="text"
        placeholder="filter..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={newGarment}>new</button>
      <button onClick={saveChanges}>save</button>
      <button onClick={removeSelected}>delete</button>
      <form>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>select</th>
              <th>brand</th>
              <th>title</th>
              <th>price</th>
              <th>color</th>
              <th>size</th>
              <th>for sale</th>
            </tr>
          </thead>
          <tbody>
            {filteredGarments.map((garment) => (
              <tr
                key={garment.id}
                className={edited.includes(garment.id) ? "editedtr" : ""}
              >
                <td>
                  <input
                    name={garment.id + "-select"}
                    type="checkbox"
                    checked={selected.includes(garment.id)}
                    onChange={(e) => handleSelectChange(e, garment.id)}
                  ></input>
                </td>
                <td>
                  <input
                    name={garment.id + "-brand"}
                    type="text"
                    placeholder="brand"
                    value={garment.brand}
                    onChange={(e) => handleNewChange(e, garment.id)}
                    disabled={!selected.includes(garment.id)}
                  ></input>
                </td>
                <td>
                  <input
                    name={garment.id + "-title"}
                    type="text"
                    placeholder="title"
                    value={garment.title}
                    onChange={(e) => handleNewChange(e, garment.id)}
                    disabled={!selected.includes(garment.id)}
                  ></input>
                </td>
                <td>
                  <input
                    name={garment.id + "-price"}
                    type="text"
                    placeholder="price"
                    value={garment.price}
                    onChange={(e) => handleNewChange(e, garment.id)}
                    disabled={!selected.includes(garment.id)}
                  ></input>
                </td>
                <td>
                  <input
                    name={garment.id + "-color"}
                    type="text"
                    placeholder="color"
                    value={garment.color}
                    onChange={(e) => handleNewChange(e, garment.id)}
                    disabled={!selected.includes(garment.id)}
                  ></input>
                </td>
                <td>
                  <input
                    name={garment.id + "-size"}
                    type="text"
                    placeholder="size"
                    value={garment.size}
                    onChange={(e) => handleNewChange(e, garment.id)}
                    disabled={!selected.includes(garment.id)}
                  ></input>
                </td>
                <td>
                  <input
                    type="radio"
                    name={garment.id + "-forSale"}
                    value="true"
                    checked={garment.forSale === true}
                    onChange={(e) => handleForSaleChange(e, garment.id)}
                    disabled={!selected.includes(garment.id)}
                  />{" "}
                  True
                  <input
                    type="radio"
                    name={garment.id + "-forSale"}
                    value="false"
                    checked={garment.forSale === false}
                    onChange={(e) => handleForSaleChange(e, garment.id)}
                    disabled={!selected.includes(garment.id)}
                  />{" "}
                  False
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </>
  );
}

export default Test;
