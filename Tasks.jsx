import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskRecords } from "../context/TaskRecordsContext";
import { useBalance } from "../context/balanceContext";
import { useToast } from "../context/ToastContext";
import "./Tasks.css";

import Header from "../components/Header";

import avatar from "../assets/images/profile/avatar.png";
import vip2 from "../assets/images/vip/vip2.png";
import noticeIcon from "../assets/images/header/notification.png";
import homeIcon from "../assets/images/tabBar/homeh.png";
import startingIcon from "../assets/images/tabBar/icon30.png";
import recordsIcon from "../assets/images/tabBar/records.png";
import startButtonImg from "../assets/images/start/startbutton.png";

// Use Cloudinary images for the grid
const CLOUDINARY_BASE = "https://res.cloudinary.com/dhubpqnss/image/upload/v1748650920/products/";
const imageStart = 42;
const imageEnd = 442;
const totalImages = imageEnd - imageStart + 1;
const imageList = Array.from(
  { length: totalImages },
  (_, i) => `${CLOUDINARY_BASE}product1_${i + imageStart}.jpg`
);

const getRandomProducts = () => {
  const shuffled = [...imageList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 9);
};

const vipConfig = {
  1: { taskLimit: 40 },
  2: { taskLimit: 45 },
  3: { taskLimit: 50 },
  4: { taskLimit: 55 },
};

const HEADER_HEIGHT = 64;
const BLACK_BG_HEIGHT = 322;
const START_BLUE = "#1fb6fc";
const BLACK_BG = "#181c23";

// Spinner component for overlay
function Spinner({ size = 36, color = "#bbb", style = {} }) {
  return (
    <div
      style={{
        border: `3px solid #ececec`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
        width: size,
        height: size,
        animation: "spin 0.9s linear infinite",
        ...style,
      }}
    />
  );
}

// Overlay for fading transition
function FadeOverlay({ show, children }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 11000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "all",
        transition: "opacity 0.5s"
      }}
    >
      {children}
      <style>
        {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

function OptimizingToast({ show }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "-60px",
        transform: "translateX(-50%)",
        background: "rgba(60,60,60,0.72)",
        color: "#fff",
        borderRadius: 13,
        padding: "7px 28px 7px 15px",
        fontWeight: 600,
        fontSize: 17,
        boxShadow: "0 2px 10px #0002",
        display: "flex",
        alignItems: "center",
        opacity: show ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.7s cubic-bezier(.4,0,.2,1)",
        zIndex: 10,
      }}
    >
      <Spinner size={22} color="#b2b2b2" style={{ marginRight: 10, filter: "blur(0.5px)" }} />
      Optimizing...
    </div>
  );
}

function GreyToast({ show, message }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "22%",
        transform: "translateX(-50%)",
        background: "#eee",
        color: "#666",
        borderRadius: 10,
        padding: "10px 28px",
        fontWeight: 500,
        fontSize: 15.5,
        boxShadow: "0 2px 12px #0001",
        zIndex: 99999,
        minWidth: 210,
        maxWidth: "80vw",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          border: "3px solid #e0e0e0",
          borderTop: "3px solid #bbb",
          borderRadius: "50%",
          marginRight: 13,
          display: "inline-block",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span>{message}</span>
      <style>
        {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

// Combo config
const COMBO_TRIGGER_INDEX = 15; // set your combo trigger here (1-based, e.g. 15 means combo at 15/40)

const Tasks = () => {
  const [productGrid, setProductGrid] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [showOptimizingOverlay, setShowOptimizingOverlay] = useState(false);
  const [showOptimizingToast, setShowOptimizingToast] = useState(false);
  const [submitState, setSubmitState] = useState(""); // '', 'submitting', 'submitted'
  const [fadeSpinner, setFadeSpinner] = useState(false);

  // For all fading grey toasts
  const [greyToast, setGreyToast] = useState({ show: false, message: "" });

  const navigate = useNavigate();
  const {
    addTaskRecord,
    submitTaskRecord,
    hasPendingTask,
    hasPendingComboTask,
    records,
    fetchTaskRecords,
  } = useTaskRecords();

  const {
    balance,
    commissionToday,
    username,
    vipLevel,
    refreshProfile,
    userProfile
  } = useBalance();

  const { showToast } = useToast();

  // --- Commission reset at midnight logic ---
  const [localCommissionToday, setLocalCommissionToday] = useState(commissionToday);

  useEffect(() => {
    setLocalCommissionToday(commissionToday);
  }, [commissionToday]);

  useEffect(() => {
    // Calculate ms until next midnight
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0, 0
    );
    const msUntilMidnight = nextMidnight - now;

    const timer = setTimeout(() => {
      setLocalCommissionToday(0);
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [commissionToday]);

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    setProductGrid(getRandomProducts());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProductGrid(getRandomProducts());
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // --- Custom task count logic: combo counts as 1, not 2 ---
  function getCurrentTaskCountThisSet() {
    if (!records || !userProfile) return 0;
    const currentSet = userProfile.currentSet ?? 1;
    let comboTaskCodes = new Set();
    let count = 0;
    records.forEach(r => {
      if (
        r.status === "Completed" &&
        (r.set === currentSet || r.set === undefined)
      ) {
        if (r.isCombo) {
          // Only count once for the combo group (by taskCode)
          if (r.taskCode && !comboTaskCodes.has(r.taskCode)) {
            count += 1;
            comboTaskCodes.add(r.taskCode);
          }
        } else {
          count += 1;
        }
      }
    });
    // Also count pending tasks/combo so the UI is accurate (but combo as 1)
    let pendingComboCodes = new Set();
    let hasPendingCombo = false;
    records.forEach(r => {
      if (
        r.status === "Pending" &&
        (r.set === currentSet || r.set === undefined)
      ) {
        if (r.isCombo) {
          if (r.taskCode && !pendingComboCodes.has(r.taskCode)) {
            hasPendingCombo = true;
            pendingComboCodes.add(r.taskCode);
          }
        } else {
          count += 1;
        }
      }
    });
    if (hasPendingCombo) count += 1;
    return count;
  }

  const maxTasks =
    (userProfile && userProfile.maxTasks) ||
    vipConfig[Number(vipLevel)]?.taskLimit ||
    40;

  const todaysTasks = getCurrentTaskCountThisSet();

  // Helper: show grey toast with spinner
  const showGreyToast = (message, duration = 1600) => {
    setGreyToast({ show: true, message });
    setTimeout(() => setGreyToast({ show: false, message: "" }), duration);
  };

  // --- "Start" click handler for combo and normal logic ---
  const handleStartTask = async () => {
    // BLOCK: if ANY previous (normal or combo) task is pending, block with the same message!
    if (hasPendingTask() || hasPendingComboTask()) {
      showGreyToast("Please submit the previous rating before you proceed.");
      return;
    }

    if (todaysTasks >= maxTasks) {
      showGreyToast("Task set complete. Please contact customer service for reset.");
      return;
    }

    // Combo hit: block modal, show toast, redirect to deposit page
    if (todaysTasks + 1 === COMBO_TRIGGER_INDEX) {
      setOptimizing(false);
      setShowOptimizingOverlay(false);
      setShowOptimizingToast(false);
      showGreyToast(
        "Please submit the previous rating before you proceed.",
        1800
      );
      setTimeout(() => {
        navigate("/deposit");
      }, 1800);
      return;
    }

    setOptimizing(true);
    setShowOptimizingOverlay(true);
    setShowOptimizingToast(true);

    const imageForTask = productGrid[4];

    setTimeout(() => setShowOptimizingToast(false), 1150);

    try {
      const result = await addTaskRecord({ image: imageForTask });
      setOptimizing(false);
      setShowOptimizingOverlay(false);

      if (result && result.isCombo) {
        // Combo was triggered by backend: don't show modal
        showGreyToast("Please submit the previous rating before you proceed.", 1800);
        setTimeout(() => {
          navigate("/deposit");
        }, 1800);
        return;
      }

      if (result && result.task) {
        const backendTask = result.task;
        if (!backendTask.product?.image) {
          backendTask.product = backendTask.product || {};
          backendTask.product.image = imageForTask;
        }
        setCurrentTask(backendTask);
        setShowModal(true);
        setSubmitState("");
        refreshProfile && refreshProfile();
      } else {
        showGreyToast("Failed to start task. Please try again later.");
      }
    } catch (err) {
      setOptimizing(false);
      setShowOptimizingOverlay(false);
      showGreyToast("API error: " + (err.message || err));
    }
  };

  // Modal submit logic: show spinner with "Submitting...", then spinner "Submitted!", then go back
  const handleSubmitTask = async () => {
    setSubmitState("submitting");
    setTimeout(async () => {
      const result = await submitTaskRecord(currentTask.taskCode);
      if (result.success) {
        setSubmitState("submitted");
        setTimeout(() => {
          setShowModal(false);
          setCurrentTask(null);
          setSubmitState("");
          setFadeSpinner(true);
          setTimeout(() => {
            setFadeSpinner(false);
            navigate("/tasks");
          }, 900);
        }, 900);
      } else {
        setSubmitState("");
        showGreyToast(result.message || "Failed to submit task");
      }
    }, 1000);
  };

  function renderTaskModal() {
    if (!currentTask) return null;
    const product = currentTask.product || {};
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2" style={{fontFamily:"Arial,sans-serif"}}>
        <div
          className="w-full max-w-lg bg-white rounded-[18px] shadow-xl"
          style={{
            minWidth: 320,
            maxWidth: 460,
            borderRadius: 18,
            border: "none",
            boxShadow: "0 10px 40px #0002, 0 0 1px #0001",
            paddingBottom: 20
          }}
        >
          <div className="flex justify-between items-center mb-0 px-6 pt-6 pb-1">
            <div
              style={{
                fontWeight: 700,
                fontSize: 24,
                color: "#232323",
                letterSpacing: "0.01em"
              }}
            >
              Task Submission
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 text-2xl px-2 py-1 rounded hover:bg-gray-100"
              style={{ lineHeight: 1, background: "none", border: "none" }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          {/* Product info horizontal row */}
          <div className="flex flex-row items-center px-6" style={{marginTop:6, marginBottom:10}}>
            <img
              src={product.image}
              alt="Product"
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                objectFit: "cover",
                marginRight: 14,
                boxShadow: "0 2px 10px #0001"
              }}
            />
            <div style={{flex:1, minWidth:0}}>
              <div style={{
                fontWeight: 700,
                fontSize: 21.5,
                color: "#222",
                marginBottom: 2,
                letterSpacing: 0.01,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.15"
              }}>
                {product.name}
              </div>
              <div style={{
                fontWeight: 400,
                fontSize: 19,
                color: "#222",
                marginBottom: 1,
                lineHeight: "1.12"
              }}>
                <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span>{" "}
                <span style={{ color: START_BLUE, fontWeight: 700 }}>{product.price}</span>
              </div>
              <div style={{
                margin: "2px 0 0 0",
                display: "flex",
                alignItems: "center"
              }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="21" height="21" viewBox="0 0 32 32" fill="#FFD700" style={{ marginRight: i < 4 ? 1 : 0 }}>
                    <polygon points="16,2 20,12 31,12.5 22,19 25,29 16,23.5 7,29 10,19 1,12.5 12,12" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            borderTop: "1px solid #ededed",
            margin: "3px 0 0 0"
          }} />
          {/* Amounts row */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "14px 8px 8px 8px"
          }}>
            <div style={{
              flex: 1,
              textAlign: "center"
            }}>
              <div style={{
                fontWeight: 700,
                fontSize: 17,
                color: "#6a6b72",
                marginBottom: 3
              }}>Total Amount</div>
              <div style={{
                color: START_BLUE,
                fontWeight: 700,
                fontSize: 21.5,
                letterSpacing: ".01em"
              }}>
                <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span> {product.price}
              </div>
            </div>
            <div style={{
              flex: 1,
              textAlign: "center"
            }}>
              <div style={{
                fontWeight: 700,
                fontSize: 17,
                color: "#6a6b72",
                marginBottom: 3
              }}>Commission</div>
              <div style={{
                color: START_BLUE,
                fontWeight: 700,
                fontSize: 21.5,
                letterSpacing: ".01em"
              }}>
                <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span> {product.commission}
              </div>
            </div>
          </div>
          <div style={{
            borderTop: "1px solid #ededed",
            margin: "0 0 0 0"
          }} />
          {/* Created At & Task Code single line */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "13px 28px 0 28px",
            fontSize: 14.5,
            fontWeight: 500,
            color: "#222",
            letterSpacing: "0.01em"
          }}>
            <div>Created At</div>
            <div style={{ fontWeight: 700 }}>
              {formatDate(product.createdAt || currentTask.createdAt)}
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 28px 0 28px",
            fontSize: 14.5,
            fontWeight: 500,
            color: "#222",
            letterSpacing: "0.01em"
          }}>
            <div>Task Code</div>
            <div style={{
              fontWeight: 700,
              color: START_BLUE,
              fontFamily: "monospace",
              fontSize: 15.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "63vw",
              textTransform: "uppercase"
            }}>
              {currentTask.taskCode}
            </div>
          </div>
          <div style={{ padding: "0 28px 0 28px", marginTop: 18 }}>
            <button
              onClick={submitState === "" ? handleSubmitTask : undefined}
              disabled={submitState !== ""}
              className="mt-2 w-full py-2 text-white rounded-full font-semibold text-lg"
              style={{
                background: START_BLUE,
                opacity: 1,
                transition: "opacity 0.2s",
                boxShadow: `0 1px 8px ${START_BLUE}22`,
                borderRadius: "18px",
                fontSize: "1.18rem",
                marginTop: 2
              }}
            >
              {submitState === "submitting" ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spinner size={24} style={{ marginRight: 9 }} color={START_BLUE} />
                  Submitting...
                </span>
              ) : submitState === "submitted" ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spinner size={24} style={{ marginRight: 9 }} color={START_BLUE} />
                  Submitted!
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Responsive Product Grid with mobile-side space only
  const renderProductGrid = () => (
    <div className="product-grid-responsive-side-space">
      {productGrid.map((src, index) => (
        <div
          key={index}
          className={
            index === 4
              ? "product-item product-item-center-circular"
              : "product-item"
          }
        >
          {index === 4 ? (
            <div className="flex items-center justify-center w-full h-full" style={{ position: "relative" }}>
              <OptimizingToast show={showOptimizingToast} />
              <button
                className={`start-button-circular${optimizing ? " rotating" : ""}`}
                onClick={optimizing ? undefined : handleStartTask}
                disabled={optimizing}
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  padding: 0,
                  width: "90%",
                  height: "90%",
                  aspectRatio: "1/1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 2px 12px ${START_BLUE}22`,
                  cursor: optimizing ? "wait" : "pointer",
                  position: "relative",
                  overflow: "hidden",
                  margin: "auto",
                  transition: "box-shadow 0.18s"
                }}
              >
                <img
                  src={startButtonImg}
                  alt="Start"
                  style={{
                    width: "78%",
                    height: "78%",
                    objectFit: "contain",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
              </button>
            </div>
          ) : (
            <img src={src} alt={`product-${index}`} />
          )}
        </div>
      ))}
      <style>
        {`
        .product-grid-responsive-side-space {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
          margin-top: 0;
          padding: 0 10px;
        }
        .product-item {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px #0001;
          overflow: hidden;
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 90px;
          min-height: 90px;
          max-width: 240px;
          max-height: 240px;
        }
        .product-item-center-circular {
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 2px 16px #0002;
          overflow: visible;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .start-button-circular {
          transition: box-shadow 0.18s;
        }
        .start-button-circular.rotating {
          animation: start-rotate 1.1s linear infinite;
        }
        @keyframes start-rotate {
          100% { transform: rotate(360deg);}
        }
        .start-button-circular:disabled {
          opacity: 0.7;
        }
        .product-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 16px;
        }
        @media (max-width: 700px) {
          .product-grid-responsive-side-space {
            gap: 5vw;
            padding-left: 6vw;
            padding-right: 6vw;
          }
        }
        @media (max-width: 520px) {
          .product-grid-responsive-side-space {
            gap: 4vw;
            padding-left: 10vw;
            padding-right: 10vw;
          }
        }
        @media (max-width: 400px) {
          .product-grid-responsive-side-space {
            gap: 2vw;
            padding-left: 7vw;
            padding-right: 7vw;
          }
        }
        `}
      </style>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-[#f5f5f5] relative">
      <Header />

      {/* Black background under header */}
      <div
        style={{
          width: "100vw",
          left: 0,
          top: HEADER_HEIGHT,
          position: "absolute",
          zIndex: 0,
          background: BLACK_BG,
          height: BLACK_BG_HEIGHT,
        }}
      />

      {/* User Info/Bar */}
      <div className="bg-transparent text-white p-4 flex items-center justify-between relative" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-3">
          <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold text-sm">Hi, {username} 👏</div>
          </div>
        </div>
        <img src={vip2} alt="VIP" className="h-7" />
      </div>

      <div className="p-4 relative" style={{ zIndex: 2 }}>
        <div className="bg-white rounded-lg shadow p-4 mb-3 flex justify-between items-center">
          <div>
            <div className="font-semibold text-sm">Total Balance</div>
            <div className="text-xs text-gray-500">Profits will be added here</div>
          </div>
          <div className="text-right font-bold" style={{ color: START_BLUE }}>
            {Number(balance).toFixed(2)}{" "}
            <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-3 flex justify-between items-center">
          <div>
            <div className="font-semibold text-sm">Today's Commission</div>
            <div className="text-xs text-gray-500">Auto reset at 00:00 daily</div>
          </div>
          <div className="text-right font-bold" style={{ color: START_BLUE }}>
            {Number(localCommissionToday).toFixed(2)}{" "}
            <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span>
          </div>
        </div>
      </div>

      <div
        className="px-4 text-sm font-semibold flex justify-between items-center mb-2 relative"
        style={{ zIndex: 3 }}
      >
        <span style={{ color: START_BLUE, textShadow: "0 1px 8px #212", fontWeight: 600 }}>
          Start Optimization
        </span>
        <span style={{ color: START_BLUE, fontWeight: 700 }} id="tasksProgress">
          {todaysTasks}/{maxTasks}
        </span>
      </div>

      <div style={{ zIndex: 3, position: "relative" }}>
        {renderProductGrid()}
      </div>

      <div className="bg-white mx-4 mt-4 p-3 rounded-lg shadow text-sm relative" style={{ zIndex: 3 }}>
        <div className="flex items-center gap-2 font-semibold mb-1">
          <img src={noticeIcon} alt="Notice" className="w-4 h-4" />
          Notice
        </div>
        <p className="text-xs text-gray-600">Online Support Hours Time 10:00–21:59</p>
      </div>

      {/* Modal for submission */}
      {showModal && renderTaskModal()}

      {/* Fading spinner overlay when navigating back */}
      <FadeOverlay show={fadeSpinner}>
        <Spinner size={44} color={START_BLUE} />
      </FadeOverlay>
      {/* Global fading grey toast */}
      <GreyToast show={greyToast.show} message={greyToast.message} />

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-end py-2 z-40" style={{height: 64}}>
        <div
          className="flex flex-col items-center text-xs cursor-pointer"
          style={{ color: "#8fadc7" }}
          onClick={() => navigate("/dashboard")}
        >
          <img src={homeIcon} alt="Home" className="w-6 h-6 mb-1" />
          Home
        </div>
        <div
          className="flex flex-col items-center text-xs font-semibold cursor-pointer"
          style={{ color: START_BLUE, transform: "translateY(-10px)" }}
        >
          <img
            src={startingIcon}
            alt="Starting"
            style={{
              width: 56,
              height: 56,
              marginBottom: 2
            }}
          />
          <span style={{ fontSize: "1.13rem", fontWeight: 700, marginTop: -6 }}>Starting</span>
        </div>
        <div
          className="flex flex-col items-center text-xs cursor-pointer"
          style={{ color: "#8fadc7" }}
          onClick={() => navigate("/records")}
        >
          <img src={recordsIcon} alt="Records" className="w-6 h-6 mb-1" />
          Records
        </div>
      </div>
    </div>
  );
};

export default Tasks;
