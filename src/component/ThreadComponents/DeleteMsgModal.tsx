import { Dialog } from "@mui/material";

interface Props {
    show: boolean;
    setShow: (newValue: boolean) => void;
    handleDeleteMessage: () => void;
}

export const DeleteMsgModal = ({ show, setShow, handleDeleteMessage }: Props) => {

    return (
        <Dialog open={show}>
            <div>
                <h1>Are you sure you want to delete this message?</h1>
                <button onClick={() => setShow(false)}>Cancel</button>
                <button onClick={() => handleDeleteMessage()}>Delete</button>
            </div>
        </Dialog>
    )
}