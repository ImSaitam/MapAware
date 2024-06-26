/* eslint-disable no-lone-blocks */
import axios from "axios";
import { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { config } from "./config.js"
import AvatarEditor from "react-avatar-editor";
import { Button } from "react-bootstrap";

function deletePicture() {
    const token = localStorage.getItem('token');
    axios.delete(`${config}/user/image`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    window.location.reload();
  }

export default function ChangeProfileImage({ onChangeImage, setChangeImageModal }) {
    const token = localStorage.getItem("token");

    const [userImage, setUserImage] = useState(null);  // Estado para guardar el archivo de la imagen
    const editorRef = useRef(null); // Referencia al editor

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editorRef.current) {
            const canvas = editorRef.current.getImage();
            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append("image", blob, "avatar.png");  // Agrega el blob de la imagen al FormData

                try {
                    const response = await axios.put(`${config}/user/image`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",  // Establece el encabezado Content-Type
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    {/* console.log("Foto cambiada.", response); */}
                    onChangeImage();
                    window.location.reload();
                } catch (error) {
                    { /* console.log("Hubo un error al cambiar la foto de perfil.", error); */}
                }
            }, "image/png");
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
            {userImage && (
                <AvatarEditor
                    ref={editorRef}
                    image={userImage}
                    width={250}
                    height={250}
                    border={50}
                    borderRadius={125} // Hace que la imagen sea circular
                    scale={1.2}
                />
            )}
            <button 
                type="submit"
                className="btn btn-primary"
            >
                Aceptar
            </button>
            <Button onClick={deletePicture} className='deletePicture btn btn-danger'>Borrar foto</Button>
        </Form>
    );
}
