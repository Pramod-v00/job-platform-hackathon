import { format } from "timeago.js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { getJobsByDistrict } from "../services/jobservice";
import "../styles/home.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (user) {
        try {
          const data = await getJobsByDistrict(user.district);
          setJobs(data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchJobs();
  }, [user]);

  if (!user) return <p>Please login to see jobs</p>;

  return (
    <div className="home-container">
      <h2>Jobs in {user.district}</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <img
                src={job.photoUrl}      // ⭐ FIXED
                alt="Job"
                className="job-photo"
              />

              <div className="job-info">
                <p><strong>📞 {job.postedBy}</strong></p>
                <p>📍 District: {job.district}</p>

                <p className="posted-time">🕒 {format(job.createdAt)}</p>

                {job.voiceUrl && (
                  <audio
                    controls
                    src={job.voiceUrl}   // ⭐ FIXED
                    className="job-audio"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
