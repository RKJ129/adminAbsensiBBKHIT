import IconButton from "@mui/material/IconButton";
import LockResetIcon from '@mui/icons-material/LockReset';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { apiKey } from "../../../utils/env";

const MySwal = withReactContent(Swal);

export default function ResetPasssword ({ id }) { 

    const btn = 'Password akun ini akan direset menjadi : <span class="badge bg-primary" style="padding: 3px 8px; border-radius: 4px; font-weight: bold;">admin</span>'

    const handleClick = async () => {
        MySwal.fire({
            title: "Reset Password?",
            html: "Apakah kamu yakin ingin mereset password?" + btn,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, reset!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if(result.isConfirmed) {
                try {
                    const { status } = await axios.post(`${apiKey}/api/admin/manage/reset-password/` + id, {}, {
                        withCredentials: true
                    });

                    if(status === 200) {
                        MySwal.fire("Berhasil!", "Password sudah direset.", "success");
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        })
    }


    return (
        <>
            <IconButton aria-label='edit' size='large' color='primary' onClick={handleClick}>
                <LockResetIcon />
            </IconButton>
        </>
    )
}