// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TermsAndConditions from "./TermsAndConditions.jsx";

function FadeMessage({ message, onDone, duration = 1200 }) {
  React.useEffect(() => {
    const timer = setTimeout(() => { if (onDone) onDone(); }, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);
  return (
    <div className="fade-message-center">
      <div className="fade-message-content">{message}</div>
      <style>{`
        .fade-message-center { position: fixed; left:0; right:0; top:48%; z-index:10000; display:flex; justify-content:center; pointer-events:none; }
        .fade-message-content { background:#181a1f; color:#fff; border-radius:8px; padding:0.7rem 2.2rem; font-weight:600; font-size:1.09rem; box-shadow:0 2px 16px #0003; text-align:center; min-width:180px; max-width:80vw; opacity:0.98; animation:fade-in-out-anim 1.2s linear;}
        @keyframes fade-in-out-anim { 0%{opacity:0;transform:scale(0.98);} 10%{opacity:1;transform:scale(1);} 90%{opacity:1;} 100%{opacity:0;} }
      `}</style>
    </div>
  );
}

function SpinnerOverlay({ duration = 500, onDone }) {
  React.useEffect(() => { const timer = setTimeout(() => { if (onDone) onDone(); }, duration); return () => clearTimeout(timer); }, [onDone, duration]);
  return (
    <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", zIndex:10000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(245,247,251,0.75)", pointerEvents:"none"}}>
      <div className="spinner" style={{ width:44, height:44, border:"4px solid #ddd", borderTop:"4px solid #216378", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} />
      <style>{`@keyframes spin {100% { transform: rotate(360deg); }}`}</style>
    </div>
  );
}

/* REGISTER SUCCESS MODAL
   Matches screenshots on mobile + desktop:
   - Centered overlay
   - White rounded card with large "REGISTRATION SUCCESSFUL" title
   - small blue underline accent
   - message text and large black "Continue" button
*/
function RegisterSuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div aria-modal="true" role="dialog" className="register-success-modal-overlay">
      <div className="register-success-modal" role="document" aria-labelledby="register-success-title">
        <h2 id="register-success-title" className="register-success-title">REGISTRATION SUCCESSFUL</h2>
        <div className="register-success-underline" aria-hidden />
        <p className="register-success-msg">Your account has been successfully created.</p>

        <button
          className="register-success-continue"
          onClick={onClose}
          aria-label="Continue"
        >
          Continue
        </button>
      </div>

      <style>{`
        /* overlay */
        .register-success-modal-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(11,18,25,0.45);
          z-index: 10050;
          padding: 24px;
          box-sizing: border-box;
        }

        .register-success-modal {
          width: 100%;
          max-width: 560px;
          background: #fbf9f8;
          border-radius: 14px;
          padding: 28px 30px;
          box-shadow: 0 20px 60px rgba(11,18,25,0.28);
          text-align: center;
        }

        .register-success-title {
          font-size: 28px;
          margin: 8px 0 12px;
          font-weight: 900;
          color: #0b0b0b;
          letter-spacing: 0.02em;
        }

        .register-success-underline {
          width: 56px;
          height: 6px;
          margin: 0 auto 18px;
          background: #1436c7; /* vivid blue */
          border-radius: 6px;
          box-shadow: 0 2px 0 rgba(20,54,199,0.08);
        }

        .register-success-msg {
          color: #0b0b0b;
          opacity: 0.9;
          margin-bottom: 22px;
          line-height: 1.6;
          font-size: 15px;
        }

        .register-success-continue {
          display: inline-block;
          width: 76%;
          max-width: 420px;
          background: #000;
          color: #fff;
          border: none;
          padding: 14px 18px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        @media (max-width: 520px) {
          .register-success-modal { padding: 20px 18px; max-width: 92vw; border-radius: 12px; }
          .register-success-title { font-size: 20px; }
          .register-success-continue { width: 100%; }
        }
      `}</style>
    </div>
  );
}

/* TERMS AND CONDITIONS MODAL - Full page view */
function TermsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 11000,
        background: "#fff",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header with close button */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 11001
      }}>
        <h2 style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: "#111"
        }}>
          Terms and Conditions
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 24,
            color: "#111",
            cursor: "pointer",
            padding: 0,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Close terms and conditions"
        >
          ×
        </button>
      </div>

      {/* Terms content - scrollable */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <TermsAndConditions />
      </div>
    </div>
  );
}

const API_URL = "https://keymuse-backend.onrender.com";

export default function Register() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [form, setForm] = useState({
    username: "", fullName:"", email:"", phone:"", password:"", confirmPassword:"",
    withdrawalPassword:"", confirmSecondaryPassword:"", inviteCode:"", agreed:false
  });
  const [fadeMsg, setFadeMsg] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const handleChange = (e) => { const { name,value,type,checked } = e.target; setForm(f => ({...f, [name]: type==="checkbox"?checked:value})); };

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!form.agreed){ setFadeMsg("Please agree to the Terms and Conditions."); return; }
    if(form.password!==form.confirmPassword){ setFadeMsg("Passwords do not match."); return; }
    if(form.withdrawalPassword!==form.confirmSecondaryPassword){ setFadeMsg("Secondary passwords do not match."); return; }
    try{
      const res = await fetch(`${API_URL}/api/users/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          username:form.username, fullName:form.fullName, email:form.email, phone:form.phone,
          loginPassword:form.password, withdrawalPassword:form.withdrawalPassword, inviteCode:form.inviteCode
        })
      });
      const data = await res.json();
      if(res.ok && data.success) {
        setFadeMsg("Registration Successful");
        setShowSuccessModal(true);
      } else {
        setFadeMsg(data.message || "Registration failed.");
      }
    } catch { 
      setFadeMsg("Server error. Please try again later."); 
    }
  };

  // Called when modal Continue is clicked
  const onModalContinue = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  React.useEffect(()=>{
    if(fadeMsg && fadeMsg!=="Registration Successful"){ 
      const timer=setTimeout(()=>setFadeMsg(""),1200); 
      return ()=>clearTimeout(timer); 
    }
  },[fadeMsg]);

  return (
    <div className="register-bg-hero" style={{background:"#efece9"}}>
      <Header onMenuClick={() => setSidebarOpen(true)} isLoginPage={true} />
      {fadeMsg && <FadeMessage message={fadeMsg}/>}
      {showSpinner && <SpinnerOverlay/>}

      {/* Success modal */}
      <RegisterSuccessModal open={showSuccessModal} onClose={onModalContinue} />

      {/* Terms and Conditions Modal - Full page */}
      <TermsModal open={termsModalOpen} onClose={() => setTermsModalOpen(false)} />

      {/* Use shared Sidebar component */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{display:"flex", justifyContent:"center", padding:"40px 16px"}}>
        <div style={{maxWidth:1100, width:"100%"}}>
          <button style={{background:"#dcd8d4", border:"none", color:"#222", padding:"8px 12px", borderRadius:8, fontWeight:700, marginBottom:24, cursor:"pointer"}} onClick={()=>window.history.back()}>← BACK</button>

          <h1 className="register-title" style={{
            fontWeight:900,
            color:"#111",
            marginBottom:24,
            fontFamily:"Arial, sans-serif",
            fontSize:"28px", // fixed to match your screenshot
            whiteSpace:"nowrap", // ensure stays on one line
            overflow:"hidden",
            textOverflow:"ellipsis"
          }}>
            CREATE AN ACCOUNT
          </h1>

          <form onSubmit={handleRegister} style={{display:"grid",gap:16}}>
            <div className="register-grid">
              <div>
                <label>Username*</label>
                <input name="username" value={form.username} onChange={handleChange} required placeholder="Username"/>
              </div>
              <div>
                <label>Full Name*</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Full Name"/>
              </div>
              <div>
                <label>Email*</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email"/>
              </div>
              <div>
                <label>Phone Number*</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="Phone Number"/>
              </div>
              <div>
                <label>Password*</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password"/>
              </div>
              <div>
                <label>Secondary Password*</label>
                <input name="withdrawalPassword" type="password" value={form.withdrawalPassword} onChange={handleChange} required placeholder="Secondary Password"/>
              </div>
              <div>
                <label>Confirm Password*</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirm Password"/>
              </div>
              <div>
                <label>Confirm Secondary Password*</label>
                <input name="confirmSecondaryPassword" type="password" value={form.confirmSecondaryPassword} onChange={handleChange} required placeholder="Confirm Secondary Password"/>
              </div>
              <div>
                <label>Referral Code*</label>
                <input name="inviteCode" value={form.inviteCode} onChange={handleChange} placeholder="Referral Code"/>
              </div>
            </div>

            <div style={{display:"flex", alignItems:"center", marginTop:8}}>
              <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} style={{width:16,height:16}}/>
              <label style={{marginLeft:6,fontSize:13,color:"#222"}}>
                By registering, your account will be subject to&nbsp;
                <button 
                  type="button" 
                  style={{background:"none",border:"none",padding:0,margin:0,color:"#0645d6",textDecoration:"underline",cursor:"pointer"}} 
                  onClick={(e) => {
                    e.preventDefault();
                    setTermsModalOpen(true);
                  }}
                >
                  Terms and Conditions
                </button>
              </label>
            </div>

            <button type="submit" style={{marginTop:12,width:"100%",padding:14,borderRadius:8,background:"linear-gradient(90deg,#0631d6,#0a4bf0)",color:"#fff",fontWeight:800,fontSize:15,border:"none",cursor:"pointer"}}>SIGN UP</button>

            <div style={{textAlign:"center",marginTop:12,fontSize:13,color:"#444"}}>
              Already have an account? <Link to="/login" style={{color:"#0645d6",fontWeight:700,textDecoration:"underline"}}>Sign in here</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer/>

      <style>{`
        .register-grid {
          display: grid;
          gap: 12px;
        }
        .register-grid > div { display:flex; flex-direction:column; }
        @media(min-width:768px){ .register-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        @media(max-width:767px){ .register-grid { grid-template-columns: 1fr; } }

        input { border-radius:8px; border:1px solid #eee; padding:12px; font-size:14px; background:#fff; }
        label { font-weight:700; font-size:13px; color:#222; margin-bottom:6px; }
      `}</style>
    </div>
  );
}
