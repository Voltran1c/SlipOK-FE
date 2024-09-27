import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [slipData, setSlipData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("files", selectedFile);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setSlipData(data);
        alert("Slip uploaded successfully!");
        console.log("Response:", data);
      } else {
        alert("Failed to upload Slip. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("An error occurred while uploading slip.");
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SlipOK
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="sm" sx={{ marginTop: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
            {imageUrl && <img src={imageUrl} alt="Preview" width={300} />}
            {slipData && (
              <Box>
                <CheckOutlinedIcon />
                <Typography variant="body1" gutterBottom>
                  SendingBank: {slipData?.data?.sendingBank}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Sender: {slipData?.data?.sender?.displayName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  ReceivingBank: {slipData?.data?.receivingBank}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Receiver: {slipData?.data?.receiver?.displayName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Amount: {slipData?.data?.amount}
                </Typography>
              </Box>
            )}
            <Button type="submit" variant="contained">
              Upload Slip
            </Button>
          </Stack>
        </form>
      </Container>
    </div>
  );
}
