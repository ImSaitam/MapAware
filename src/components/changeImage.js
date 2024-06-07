import axios from "axios";
import { useState } from "react";
import { Form } from "react-bootstrap";

export default function ChangeProfileImage({ onChangeImage, setChangeImageModal }) {
    const token = localStorage.getItem("token");

    const [userImage, setUserImage] = useState(null);  // Estado para guardar el archivo de la imagen

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("image", userImage);  // Agrega el archivo de la imagen al FormData

            const response = await axios.put("http://localhost:8080/user/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",  // Establece el encabezado Content-Type
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Foto cambiada.", response);
            onChangeImage();
        }
        catch (error) {
            console.log("Hubo un error al cambiar la foto de perfil.", error);
        }
    };

    const handleImageChange = (e) => {
        setUserImage(e.target.files[0]);  // Actualiza el estado con el archivo seleccionado
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Control 
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleImageChange}
                />
            </Form.Group>
            <button 
                type="submit"
                className="btn btn-primary"
            >
                Aceptar
            </button>
        </Form>
    );
}
