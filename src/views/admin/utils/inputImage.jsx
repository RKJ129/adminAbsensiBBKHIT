import { Button } from "react-bootstrap";


function InputImage () {

    return (
        <>
            <div className="mb-3">
                <div 
                    className="border border-primary mb-3 rounded-circle m-auto"
                    style={{ 
                        width: '150px', height: '150px' 
                    }}
                >
                    <img className="rounded-circle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://picsum.photos/200/300" />
                </div>
                <div className="d-flex justify-content-center">
                    <Button variant="primary" size="sm">Pilih Gambar</Button>
                </div>
            </div>

        </>
    )
}

export default InputImage;