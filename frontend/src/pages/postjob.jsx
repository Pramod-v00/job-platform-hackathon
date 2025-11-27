import { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/authcontext";
import { postJob } from "../services/jobservice";
import "../styles/postjob.css";

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const [photoFile, setPhotoFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  // ⭐ Added: Ref to reset the file input
  const photoInputRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // 🎤 Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      setError("Microphone access denied");
    }
  };

  // 🛑 Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  // 📤 Submit job
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photoFile) {
      setError("Please upload a photo");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      if (audioBlob) {
        formData.append("voice", audioBlob, "voice.webm");
      }

      formData.append("postedBy", user.phone);
      formData.append("district", user.district);

      await postJob(formData);

      alert("Job posted successfully! It will be visible after admin approval.");

      // ⭐ Reset all states
      setPhotoFile(null);
      setAudioBlob(null);
      setIsRecording(false);
      setError("");

      // ⭐ Reset file input
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }

    } catch (err) {
      console.error(err);
      setError("Error posting job");
    }
  };

  return (
    <div className="post-job-container">
      <h2>Post a Job</h2>

      <form onSubmit={handleSubmit}>
        <label>Upload Job Photo</label>
        <input
          type="file"
          accept="image/*"
          ref={photoInputRef}          // ⭐ Added here
          onChange={(e) => setPhotoFile(e.target.files[0])}
        />

        <div className="voice-section">
          <label>Record Voice Description (optional)</label>

          {!isRecording ? (
            <button type="button" onClick={startRecording}>
              🎤 Start Recording
            </button>
          ) : (
            <button type="button" onClick={stopRecording} className="stop-btn">
              ⏹ Stop Recording
            </button>
          )}

          {audioBlob && <p>✅ Voice recorded successfully!</p>}

          {audioBlob && (
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="voice-preview"
            />
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
