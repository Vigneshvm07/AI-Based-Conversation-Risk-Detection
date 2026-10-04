const textArea = document.getElementById("conversationText");
const wordCount = document.getElementById("wordCount");

textArea.addEventListener("input", updateWordCount);

function updateWordCount() {
    const text = textArea.value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = `${count} words`;
}

function scrollToAnalyzer() {
    document.getElementById("analyzer").scrollIntoView({
        behavior: "smooth"
    });
}

function clearText() {
    textArea.value = "";
    updateWordCount();
    resetResults();
}

function loadDemo() {
    setExample("aggressive");
    scrollToAnalyzer();
}

function setExample(type) {
    const examples = {
        safe: `Hello, thank you for helping me with my issue. I really appreciate your support and the quick response. Everything is working well now and I am satisfied with the service.`,

        aggressive: `I am extremely angry about this situation. You have completely ignored my problem and this is absolutely unacceptable. Fix this immediately or there will be serious consequences.`,

        fraud: `Your account has been selected for an urgent security verification. Send your password, OTP and bank details immediately to prevent your account from being blocked.`
    };

    textArea.value = examples[type];
    updateWordCount();
}

function calculateScore(text, keywords) {
    let score = 0;

    keywords.forEach(keyword => {
        if (text.includes(keyword)) {
            score += 18;
        }
    });

    return Math.min(score, 100);
}

function analyzeConversation() {
    const text = textArea.value.trim().toLowerCase();

    if (!text) {
        alert("Please enter a conversation before analyzing.");
        return;
    }

    const threatWords = [
        "kill", "hurt", "attack", "destroy", "threat",
        "danger", "weapon", "harm", "consequences",
        "revenge", "dead", "violence"
    ];

    const aggressionWords = [
        "angry", "hate", "furious", "idiot", "stupid",
        "terrible", "worst", "frustrated", "unacceptable",
        "annoyed", "shut up", "ridiculous"
    ];

    const manipulationWords = [
        "you must", "you have to", "if you don't",
        "or else", "pressure", "force", "guilty",
        "your fault", "you owe me", "immediately"
    ];

    const fraudWords = [
        "otp", "password", "bank details", "credit card",
        "account number", "send money", "verification",
        "payment", "pin", "transfer", "prize", "selected"
    ];

    const threat = calculateScore(text, threatWords);
    const aggression = calculateScore(text, aggressionWords);
    const manipulation = calculateScore(text, manipulationWords);
    const fraud = calculateScore(text, fraudWords);

    const scores = [threat, aggression, manipulation, fraud];

    let risk = Math.round(
        threat * 0.35 +
        aggression * 0.25 +
        manipulation * 0.20 +
        fraud * 0.20
    );

    risk = Math.min(risk, 100);

    if (risk === 0) {
        risk = Math.min(
            Math.round(text.length / 40),
            15
        );
    }

    let level;
    let description;
    let statusClass;

    if (risk >= 70) {
        level = "High Risk";
        description = "Multiple high-risk communication indicators were detected.";
        statusClass = "high";
    } else if (risk >= 40) {
        level = "Medium Risk";
        description = "Some potentially concerning communication patterns were detected.";
        statusClass = "medium";
    } else {
        level = "Low Risk";
        description = "No major conversation risk indicators were detected.";
        statusClass = "safe";
    }

    updateResult(
        risk,
        level,
        description,
        statusClass,
        threat,
        aggression,
        manipulation,
        fraud
    );

    updateIndicators(
        text,
        threat,
        aggression,
        manipulation,
        fraud
    );

    updateStats();
}

function updateResult(
    risk,
    level,
    description,
    statusClass,
    threat,
    aggression,
    manipulation,
    fraud
) {
    document.getElementById("riskScore").textContent = `${risk}%`;
    document.getElementById("riskLevel").textContent = level;
    document.getElementById("riskDescription").textContent = description;

    document.getElementById("threatScore").textContent = `${threat}%`;
    document.getElementById("aggressionScore").textContent = `${aggression}%`;
    document.getElementById("manipulationScore").textContent = `${manipulation}%`;
    document.getElementById("fraudScore").textContent = `${fraud}%`;

    const badge = document.getElementById("statusBadge");
    badge.className = `status ${statusClass}`;
    badge.textContent =
        statusClass === "high"
            ? "● High Risk"
            : statusClass === "medium"
            ? "● Medium Risk"
            : "● Low Risk";

    const circle = document.querySelector(".score-circle");

    circle.style.background =
        `conic-gradient(var(--primary) ${risk * 3.6}deg, #eeeeF5 0deg)`;
}

function updateIndicators(
    text,
    threat,
    aggression,
    manipulation,
    fraud
) {
    const container = document.getElementById("indicators");
    container.innerHTML = "";

    const indicators = [];

    if (threat > 0) {
        indicators.push("Threatening Language");
    }

    if (aggression > 0) {
        indicators.push("Aggressive Tone");
    }

    if (manipulation > 0) {
        indicators.push("Pressure / Coercion");
    }

    if (fraud > 0) {
        indicators.push("Possible Fraud");
    }

    if (text.includes("urgent") || text.includes("immediately")) {
        indicators.push("Urgency Pattern");
    }

    if (
        text.includes("password") ||
        text.includes("otp") ||
        text.includes("pin")
    ) {
        indicators.push("Sensitive Information Request");
    }

    if (indicators.length === 0) {
        container.innerHTML =
            `<span class="empty-indicator">No significant indicators detected</span>`;
        return;
    }

    indicators.forEach(indicator => {
        const element = document.createElement("span");
        element.className = "indicator";
        element.textContent = indicator;
        container.appendChild(element);
    });
}

function resetResults() {
    document.getElementById("riskScore").textContent = "0%";
    document.getElementById("riskLevel").textContent = "No Analysis";

    document.getElementById("riskDescription").textContent =
        "Enter conversation text to begin analysis.";

    document.getElementById("threatScore").textContent = "0%";
    document.getElementById("aggressionScore").textContent = "0%";
    document.getElementById("manipulationScore").textContent = "0%";
    document.getElementById("fraudScore").textContent = "0%";

    const badge = document.getElementById("statusBadge");
    badge.className = "status safe";
    badge.textContent = "● Waiting";

    document.querySelector(".score-circle").style.background =
        "conic-gradient(var(--primary) 0deg, #eeeeF5 0deg)";

    document.getElementById("indicators").innerHTML =
        `<span class="empty-indicator">No indicators detected yet</span>`;
}

function updateStats() {
    const totalElement = document.getElementById("totalAnalyses");
    const highRiskElement = document.getElementById("highRisk");

    let total = parseInt(
        totalElement.textContent.replace(",", "")
    );

    total++;

    totalElement.textContent = total.toLocaleString();

    const risk = parseInt(
        document.getElementById("riskScore").textContent
    );

    if (risk >= 70) {
        let high = parseInt(highRiskElement.textContent);
        high++;
        highRiskElement.textContent = high;
    }
}

const riskChart = new Chart(
    document.getElementById("riskChart"),
    {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Risk Score",
                data: [32, 48, 41, 67, 52, 76, 58],
                borderWidth: 3,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    }
);

const categoryChart = new Chart(
    document.getElementById("categoryChart"),
    {
        type: "doughnut",
        data: {
            labels: [
                "Threat",
                "Aggression",
                "Manipulation",
                "Fraud"
            ],
            datasets: [{
                data: [18, 34, 27, 21],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: "68%",
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    }
);