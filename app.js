// ============================================================
// OGWEYOJR TIPS - FOOTBALL ANALYSIS ENGINE
// ============================================================

const API_URL = "https://v3.football.api-sports.io";

let competitions = [];
let selectedCompetition = null;


// ============================================================
// API REQUEST
// ============================================================

async function apiRequest(endpoint) {

    try {

        const response = await fetch(
            API_URL + endpoint,
            {
                method: "GET",
                headers: {
                    "x-apisports-key": API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("API:", endpoint);
        console.log("Response:", data);

        return data;

    } catch (error) {

        console.error("API ERROR:", error);

        return null;
    }
}


// ============================================================
// LOAD COUNTRIES
// ============================================================

async function loadCountries() {

    const country =
        document.getElementById("country");

    if (!country) {
        console.error("Country selector missing.");
        return;
    }

    country.innerHTML =
        `<option value="">Loading countries...</option>`;

    const data =
        await apiRequest("/countries");

    if (
        !data ||
        !Array.isArray(data.response)
    ) {

        country.innerHTML =
            `<option value="">
                Unable to load countries
            </option>`;

        return;
    }

    country.innerHTML =
        `<option value="">
            🌍 Select Country / Region
        </option>`;

    const countries =
        [...data.response].sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    countries.forEach(item => {

        const option =
            document.createElement("option");

        option.value =
            item.name;

        option.textContent =
            item.name;

        country.appendChild(option);

    });

    console.log(
        "Countries loaded:",
        countries.length
    );
}


// ============================================================
// LOAD WORLDWIDE COMPETITIONS
// ============================================================

async function loadCompetitions() {

    const data =
        await apiRequest(
            "/leagues?current=true"
        );

    if (
        !data ||
        !Array.isArray(data.response)
    ) {

        console.error(
            "Unable to load competitions."
        );

        return;
    }

    competitions =
        data.response;

    console.log(
        "Worldwide competitions loaded:",
        competitions.length
    );
}


// ============================================================
// SHOW COMPETITIONS
// ============================================================

function showCompetitions() {

    const country =
        document.getElementById("country");

    const competition =
        document.getElementById("competition");

    const season =
        document.getElementById("season");

    const type =
        document.getElementById("competition-type");

    const home =
        document.getElementById("home-team");

    const away =
        document.getElementById("away-team");


    if (
        !country ||
        !competition
    ) {
        return;
    }


    competition.innerHTML =
        `<option value="">
            🏆 Select Competition
        </option>`;


    if (season) {

        season.innerHTML =
            `<option value="">
                Select competition first
            </option>`;
    }


    if (type) {

        type.innerHTML =
            `<option value="">
                Select competition first
            </option>`;
    }


    if (home) {

        home.innerHTML =
            `<option value="">
                Select competition first
            </option>`;
    }


    if (away) {

        away.innerHTML =
            `<option value="">
                Select competition first
            </option>`;
    }


    if (!country.value) {
        return;
    }


    const countryName =
        country.value;


    const filtered =
        competitions.filter(item =>

            item.country &&
            item.country.name === countryName

        );


    filtered.sort(
        (a, b) =>
            a.league.name.localeCompare(
                b.league.name
            )
    );


    filtered.forEach(item => {

        const option =
            document.createElement("option");

        option.value =
            item.league.id;

        option.textContent =
            `${item.league.name} (${item.league.type})`;

        competition.appendChild(option);

    });


    console.log(
        `${countryName} competitions:`,
        filtered.length
    );
}


// ============================================================
// COMPETITION CHANGED
// ============================================================

function competitionChanged() {

    const competition =
        document.getElementById("competition");

    const season =
        document.getElementById("season");

    const type =
        document.getElementById("competition-type");

    const home =
        document.getElementById("home-team");

    const away =
        document.getElementById("away-team");


    if (
        !competition ||
        !season ||
        !type ||
        !home ||
        !away
    ) {
        return;
    }


    season.innerHTML =
        `<option value="">
            📅 Select Season
        </option>`;


    home.innerHTML =
        `<option value="">
            Select season first
        </option>`;


    away.innerHTML =
        `<option value="">
            Select season first
        </option>`;


    type.innerHTML =
        `<option value="">
            Select competition
        </option>`;


    const leagueId =
        Number(competition.value);


    if (!leagueId) {

        selectedCompetition = null;

        return;
    }


    selectedCompetition =
        competitions.find(
            item =>
                Number(item.league.id) ===
                leagueId
        );


    if (!selectedCompetition) {
        return;
    }


    type.innerHTML =
        `<option value="">
            ${selectedCompetition.league.type}
        </option>`;


    const seasons =
        selectedCompetition.seasons || [];


    seasons.sort(
        (a, b) =>
            b.year - a.year
    );


    if (seasons.length === 0) {

        season.innerHTML =
            `<option value="">
                No seasons available
            </option>`;

        return;
    }


    seasons.forEach(item => {

        const option =
            document.createElement("option");

        option.value =
            item.year;


        if (item.current) {

            option.textContent =
                `${item.year} - Current`;

        } else {

            option.textContent =
                `${item.year}`;
        }


        season.appendChild(option);

    });


    console.log(
        "Seasons:",
        seasons.map(
            item => item.year
        )
    );
}


// ============================================================
// SEASON CHANGED
// ============================================================

async function seasonChanged() {

    await loadTeams();

    await loadMatches();
}


// ============================================================
// LOAD TEAMS
// ============================================================

async function loadTeams() {

    const competition =
        document.getElementById("competition");

    const season =
        document.getElementById("season");

    const home =
        document.getElementById("home-team");

    const away =
        document.getElementById("away-team");


    if (
        !competition ||
        !season ||
        !home ||
        !away
    ) {
        return;
    }


    if (
        !competition.value ||
        !season.value
    ) {
        return;
    }


    home.innerHTML =
        `<option value="">
            ⏳ Loading teams...
        </option>`;


    away.innerHTML =
        `<option value="">
            ⏳ Loading teams...
        </option>`;


    const data =
        await apiRequest(
            `/teams?league=${competition.value}&season=${season.value}`
        );


    if (
        !data ||
        !Array.isArray(data.response) ||
        data.response.length === 0
    ) {

        home.innerHTML =
            `<option value="">
                No teams available
            </option>`;


        away.innerHTML =
            `<option value="">
                No teams available
            </option>`;


        console.warn(
            `No teams available for season ${season.value}`
        );

        return;
    }


    home.innerHTML =
        `<option value="">
            🏠 Select Home Team
        </option>`;


    away.innerHTML =
        `<option value="">
            ✈️ Select Away Team
        </option>`;


    const teams =
        [...data.response].sort(
            (a, b) =>
                a.team.name.localeCompare(
                    b.team.name
                )
        );


    teams.forEach(item => {

        const homeOption =
            document.createElement("option");

        homeOption.value =
            item.team.id;

        homeOption.textContent =
            item.team.name;

        home.appendChild(
            homeOption
        );


        const awayOption =
            document.createElement("option");

        awayOption.value =
            item.team.id;

        awayOption.textContent =
            item.team.name;

        away.appendChild(
            awayOption
        );

    });


    console.log(
        `Teams loaded: ${teams.length}`
    );
}


// ============================================================
// LOAD FIXTURES
// ============================================================

async function loadMatches() {

    const competition =
        document.getElementById("competition");

    const season =
        document.getElementById("season");

    const container =
        document.getElementById("matches-container");


    if (
        !competition ||
        !season ||
        !container
    ) {
        return;
    }


    if (
        !competition.value ||
        !season.value
    ) {
        return;
    }


    container.innerHTML =
        `<div class="match-card">
            <h3>⏳ Loading fixtures...</h3>
        </div>`;


    const data =
        await apiRequest(
            `/fixtures?league=${competition.value}&season=${season.value}`
        );


    if (
        !data ||
        !Array.isArray(data.response)
    ) {

        container.innerHTML =
            `<div class="match-card">
                <h3>Fixtures unavailable</h3>
            </div>`;

        return;
    }


    if (data.response.length === 0) {

        container.innerHTML =
            `<div class="match-card">
                <h3>No fixtures available</h3>
            </div>`;

        return;
    }


    container.innerHTML = "";


    data.response
        .slice(0, 10)
        .forEach(match => {

            const card =
                document.createElement("div");

            card.className =
                "match-card";


            const date =
                new Date(
                    match.fixture.date
                );


            card.innerHTML = `

                <h3>
                    ${match.teams.home.name}
                    vs
                    ${match.teams.away.name}
                </h3>

                <p>
                    ${date.toLocaleString()}
                </p>

                <strong>
                    ${match.fixture.status.short}
                </strong>

            `;


            container.appendChild(card);

        });
}


// ============================================================
// GET RECENT FIXTURES
// ============================================================

async function getRecentFixtures(teamId) {

    const data =
        await apiRequest(
            `/fixtures?team=${teamId}&last=10`
        );


    if (
        !data ||
        !Array.isArray(data.response)
    ) {
        return [];
    }


    return data.response;
}


// ============================================================
// GET HEAD TO HEAD
// ============================================================

async function getHeadToHead(
    homeId,
    awayId
) {

    const data =
        await apiRequest(
            `/fixtures/headtohead?h2h=${homeId}-${awayId}&last=10`
        );


    if (
        !data ||
        !Array.isArray(data.response)
    ) {
        return [];
    }


    return data.response;
}


// ============================================================
// CALCULATE FORM
// ============================================================

function calculateForm(
    fixtures,
    teamId
) {

    if (
        !Array.isArray(fixtures) ||
        fixtures.length === 0
    ) {

        return {
            available: false
        };
    }


    let wins = 0;
    let draws = 0;
    let losses = 0;

    let goalsScored = 0;
    let goalsConceded = 0;

    const form = [];


    fixtures.forEach(match => {

        const homeId =
            Number(match.teams.home.id);

        const awayId =
            Number(match.teams.away.id);


        const isHome =
            homeId === Number(teamId);

        const isAway =
            awayId === Number(teamId);


        if (
            !isHome &&
            !isAway
        ) {
            return;
        }


        const homeGoals =
            Number(match.goals.home);

        const awayGoals =
            Number(match.goals.away);


        if (
            !Number.isFinite(homeGoals) ||
            !Number.isFinite(awayGoals)
        ) {
            return;
        }


        let scored;
        let conceded;


        if (isHome) {

            scored =
                homeGoals;

            conceded =
                awayGoals;

        } else {

            scored =
                awayGoals;

            conceded =
                homeGoals;
        }


        goalsScored +=
            scored;

        goalsConceded +=
            conceded;


        if (scored > conceded) {

            wins++;

            form.push("W");

        } else if (
            scored === conceded
        ) {

            draws++;

            form.push("D");

        } else {

            losses++;

            form.push("L");
        }

    });


    const matches =
        wins +
        draws +
        losses;


    if (matches === 0) {

        return {
            available: false
        };
    }


    return {

        available: true,

        matches,

        wins,

        draws,

        losses,

        goalsScored,

        goalsConceded,

        averageGoals:
            goalsScored / matches,

        averageConceded:
            goalsConceded / matches,

        form:
            form.join(" ")

    };
}


// ============================================================
// CALCULATE HOME/AWAY FORM
// ============================================================

function calculateVenueForm(
    fixtures,
    teamId,
    venue
) {

    if (
        !Array.isArray(fixtures) ||
        fixtures.length === 0
    ) {

        return {
            available: false
        };
    }


    let wins = 0;
    let draws = 0;
    let losses = 0;

    let goalsScored = 0;
    let goalsConceded = 0;


    fixtures.forEach(match => {

        const isHome =
            Number(match.teams.home.id) ===
            Number(teamId);


        const isAway =
            Number(match.teams.away.id) ===
            Number(teamId);


        if (
            venue === "home" &&
            !isHome
        ) {
            return;
        }


        if (
            venue === "away" &&
            !isAway
        ) {
            return;
        }


        const homeGoals =
            Number(match.goals.home);

        const awayGoals =
            Number(match.goals.away);


        if (
            !Number.isFinite(homeGoals) ||
            !Number.isFinite(awayGoals)
        ) {
            return;
        }


        let scored;
        let conceded;


        if (isHome) {

            scored =
                homeGoals;

            conceded =
                awayGoals;

        } else {

            scored =
                awayGoals;

            conceded =
                homeGoals;
        }


        goalsScored += scored;

        goalsConceded += conceded;


        if (scored > conceded) {

            wins++;

        } else if (
            scored === conceded
        ) {

            draws++;

        } else {

            losses++;
        }

    });


    const matches =
        wins +
        draws +
        losses;


    if (matches === 0) {

        return {
            available: false
        };
    }


    return {

        available: true,

        matches,

        wins,

        draws,

        losses,

        goalsScored,

        goalsConceded,

        averageGoals:
            goalsScored / matches,

        averageConceded:
            goalsConceded / matches

    };
}


// ============================================================
// CALCULATE H2H
// ============================================================

function calculateH2H(
    fixtures,
    homeId,
    awayId
) {

    if (
        !Array.isArray(fixtures) ||
        fixtures.length === 0
    ) {

        return {
            available: false
        };
    }


    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;

    let totalGoals = 0;

    let btts = 0;


    fixtures.forEach(match => {

        const homeGoals =
            Number(match.goals.home);

        const awayGoals =
            Number(match.goals.away);


        if (
            !Number.isFinite(homeGoals) ||
            !Number.isFinite(awayGoals)
        ) {
            return;
        }


        totalGoals +=
            homeGoals +
            awayGoals;


        if (
            homeGoals > 0 &&
            awayGoals > 0
        ) {

            btts++;
        }


        const actualHomeId =
            Number(match.teams.home.id);


        if (
            actualHomeId ===
            Number(homeId)
        ) {

            if (
                homeGoals >
                awayGoals
            ) {

                homeWins++;

            } else if (
                homeGoals ===
                awayGoals
            ) {

                draws++;

            } else {

                awayWins++;
            }

        } else {

            if (
                awayGoals >
                homeGoals
            ) {

                homeWins++;

            } else if (
                homeGoals ===
                awayGoals
            ) {

                draws++;

            } else {

                awayWins++;
            }
        }

    });


    const matches =
        homeWins +
        draws +
        awayWins;


    if (matches === 0) {

        return {
            available: false
        };
    }


    return {

        available: true,

        matches,

        homeWins,

        draws,

        awayWins,

        averageGoals:
            totalGoals / matches,

        bttsRate:
            btts / matches

    };
}


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


// ============================================================
// CALCULATE EXPECTED GOALS
// ============================================================

function calculateExpectedGoals(
    homeForm,
    awayForm,
    homeVenue,
    awayVenue
) {

    let homeXG = 1.25;
    let awayXG = 1.05;


    if (homeForm.available) {

        homeXG +=
            (homeForm.averageGoals - 1.2)
            * 0.30;

        homeXG -=
            (homeForm.averageConceded - 1.2)
            * 0.15;
    }


    if (awayForm.available) {

        awayXG +=
            (awayForm.averageGoals - 1.1)
            * 0.30;

        awayXG -=
            (awayForm.averageConceded - 1.2)
            * 0.15;
    }


    if (homeVenue.available) {

        homeXG +=
            (homeVenue.averageGoals - 1.3)
            * 0.25;

        homeXG -=
            (homeVenue.averageConceded - 1.1)
            * 0.10;
    }


    if (awayVenue.available) {

        awayXG +=
            (awayVenue.averageGoals - 1.1)
            * 0.25;

        awayXG -=
            (awayVenue.averageConceded - 1.2)
            * 0.10;
    }


    homeXG =
        Math.max(
            0.25,
            Math.min(
                homeXG,
                4.0
            )
        );


    awayXG =
        Math.max(
            0.20,
            Math.min(
                awayXG,
                4.0
            )
        );


    return {
        homeXG,
        awayXG
    };
}


// ============================================================
// POISSON PROBABILITY
// ============================================================

function poisson(
    lambda,
    goals
) {

    let factorial = 1;

    for (
        let i = 2;
        i <= goals;
        i++
    ) {

        factorial *= i;
    }


    return (
        Math.exp(-lambda) *
        Math.pow(lambda, goals)
    ) / factorial;
}


// ============================================================
// CALCULATE MATCH PROBABILITIES
// ============================================================

function calculateProbabilities(
    homeXG,
    awayXG
) {

    let homeWin = 0;
    let draw = 0;
    let awayWin = 0;

    let over15 = 0;
    let over25 = 0;
    let over35 = 0;

    let btts = 0;


    for (
        let homeGoals = 0;
        homeGoals <= 8;
        homeGoals++
    ) {

        for (
            let awayGoals = 0;
            awayGoals <= 8;
            awayGoals++
        ) {

            const probability =
                poisson(
                    homeXG,
                    homeGoals
                ) *
                poisson(
                    awayXG,
                    awayGoals
                );


            if (
                homeGoals >
                awayGoals
            ) {

                homeWin +=
                    probability;

            } else if (
                homeGoals ===
                awayGoals
            ) {

                draw +=
                    probability;

            } else {

                awayWin +=
                    probability;
            }


            const total =
                homeGoals +
                awayGoals;


            if (total >= 2) {
                over15 += probability;
            }


            if (total >= 3) {
                over25 += probability;
            }


            if (total >= 4) {
                over35 += probability;
            }


            if (
                homeGoals > 0 &&
                awayGoals > 0
            ) {

                btts += probability;
            }
        }
    }


    return {

        homeWin:
            homeWin * 100,

        draw:
            draw * 100,

        awayWin:
            awayWin * 100,

        over15:
            over15 * 100,

        over25:
            over25 * 100,

        over35:
            over35 * 100,

        btts:
            btts * 100
    };
}


// ============================================================
// NORMALIZE PROBABILITIES
// ============================================================

function normalizeProbabilities(
    probabilities
) {

    const total =
        probabilities.homeWin +
        probabilities.draw +
        probabilities.awayWin;


    if (total <= 0) {
        return probabilities;
    }


    return {

        ...probabilities,

        homeWin:
            probabilities.homeWin /
            total *
            100,

        draw:
            probabilities.draw /
            total *
            100,

        awayWin:
            probabilities.awayWin /
            total *
            100
    };
}


// ============================================================
// PREDICTION
// ============================================================

function getFinalPrediction(
    probabilities,
    homeName,
    awayName
) {

    const values = [

        {
            name:
                homeName,

            value:
                probabilities.homeWin
        },

        {
            name:
                "Draw",

            value:
                probabilities.draw
        },

        {
            name:
                awayName,

            value:
                probabilities.awayWin
        }

    ];


    values.sort(
        (a, b) =>
            b.value - a.value
    );


    const winner =
        values[0];


    let confidence =
        "Low";


    if (
        winner.value >= 65
    ) {

        confidence =
            "Very High";

    } else if (
        winner.value >= 55
    ) {

        confidence =
            "High";

    } else if (
        winner.value >= 45
    ) {

        confidence =
            "Medium";
    }


    return {

        prediction:
            winner.name === "Draw"
                ? "Draw"
                : `${winner.name} to Win`,

        confidence,

        probability:
            winner.value

    };
}


// ============================================================
// ANALYSIS HTML
// ============================================================

function teamAnalysisHTML(
    teamName,
    form
) {

    if (
        !form ||
        !form.available
    ) {

        return `

            <div class="form-card">

                <h3>
                    🔥 ${teamName}
                </h3>

                <p>
                    ⚠️ Recent statistics:
                    <strong>
                        Data unavailable
                    </strong>
                </p>

            </div>

        `;
    }


    return `

        <div class="form-card">

            <h3>
                🔥 ${teamName} Recent Form
            </h3>

            <p>
                📈 Form:
                <strong>
                    ${form.form}
                </strong>
            </p>

            <p>
                Wins:
                <strong>${form.wins}</strong>
                |
                Draws:
                <strong>${form.draws}</strong>
                |
                Losses:
                <strong>${form.losses}</strong>
            </p>

            <p>
                ⚽ Goals Scored:
                <strong>
                    ${form.goalsScored}
                </strong>
            </p>

            <p>
                🛡️ Goals Conceded:
                <strong>
                    ${form.goalsConceded}
                </strong>
            </p>

            <p>
                📊 Average Goals:
                <strong>
                    ${form.averageGoals.toFixed(2)}
                </strong>
            </p>

            <p>
                🛡️ Average Conceded:
                <strong>
                    ${form.averageConceded.toFixed(2)}
                </strong>
            </p>

        </div>

    `;
}


// ============================================================
// PROBABILITY BAR
// ============================================================

function probabilityHTML(
    homeName,
    awayName,
    probabilities
) {

    return `

        <div class="probability-section">

            <h3>
                📊 Match Probabilities
            </h3>

            <p>
                🏠 ${homeName} Win:
                <strong>
                    ${probabilities.homeWin.toFixed(1)}%
                </strong>
            </p>

            <p>
                🤝 Draw:
                <strong>
                    ${probabilities.draw.toFixed(1)}%
                </strong>
            </p>

            <p>
                ✈️ ${awayName} Win:
                <strong>
                    ${probabilities.awayWin.toFixed(1)}%
                </strong>
            </p>

            <hr>

            <p>
                ⚽ Over 1.5 Goals:
                <strong>
                    ${probabilities.over15.toFixed(1)}%
                </strong>
            </p>

            <p>
                ⚽ Over 2.5 Goals:
                <strong>
                    ${probabilities.over25.toFixed(1)}%
                </strong>
            </p>

            <p>
                ⚽ Over 3.5 Goals:
                <strong>
                    ${probabilities.over35.toFixed(1)}%
                </strong>
            </p>

            <p>
                🤝 Both Teams To Score:
                <strong>
                    ${probabilities.btts.toFixed(1)}%
                </strong>
            </p>

        </div>

    `;
}


// ============================================================
// HOME / AWAY HTML
// ============================================================

function venueHTML(
    homeName,
    awayName,
    homeVenue,
    awayVenue
) {

    return `

        <div class="venue-section">

            <h3>
                🏠 Home / Away Performance
            </h3>

            ${
                homeVenue.available

                    ? `

                    <p>
                        🏠 ${homeName} at home:
                        <strong>
                            ${homeVenue.wins}W -
                            ${homeVenue.draws}D -
                            ${homeVenue.losses}L
                        </strong>
                    </p>

                    <p>
                        Average home goals:
                        <strong>
                            ${homeVenue.averageGoals.toFixed(2)}
                        </strong>
                    </p>

                    `

                    : `

                    <p>
                        ${homeName} home data:
                        <strong>
                            Unavailable
                        </strong>
                    </p>

                    `
            }


            ${
                awayVenue.available

                    ? `

                    <p>
                        ✈️ ${awayName} away:
                        <strong>
                            ${awayVenue.wins}W -
                            ${awayVenue.draws}D -
                            ${awayVenue.losses}L
                        </strong>
                    </p>

                    <p>
                        Average away goals:
                        <strong>
                            ${awayVenue.averageGoals.toFixed(2)}
                        </strong>
                    </p>

                    `

                    : `

                    <p>
                        ${awayName} away data:
                        <strong>
                            Unavailable
                        </strong>
                    </p>

                    `
            }

        </div>

    `;
}


// ============================================================
// H2H HTML
// ============================================================

function h2hHTML(
    homeName,
    awayName,
    h2h
) {

    if (
        !h2h ||
        !h2h.available
    ) {

        return `

            <div class="h2h-section">

                <h3>
                    🆚 Head-to-Head
                </h3>

                <p>
                    Data unavailable.
                </p>

            </div>

        `;
    }


    return `

        <div class="h2h-section">

            <h3>
                🆚 Head-to-Head
            </h3>

            <p>
                Matches analyzed:
                <strong>
                    ${h2h.matches}
                </strong>
            </p>

            <p>
                🏠 ${homeName} wins:
                <strong>
                    ${h2h.homeWins}
                </strong>
            </p>

            <p>
                🤝 Draws:
                <strong>
                    ${h2h.draws}
                </strong>
            </p>

            <p>
                ✈️ ${awayName} wins:
                <strong>
                    ${h2h.awayWins}
                </strong>
            </p>

            <p>
                ⚽ Average H2H goals:
                <strong>
                    ${h2h.averageGoals.toFixed(2)}
                </strong>
            </p>

            <p>
                🤝 H2H BTTS rate:
                <strong>
                    ${(h2h.bttsRate * 100).toFixed(1)}%
                </strong>
            </p>

        </div>

    `;
}


// ============================================================
// MAIN ANALYSIS
// ============================================================

async function analyzeMatch() {

    const competition =
        document.getElementById("competition");

    const season =
        document.getElementById("season");

    const home =
        document.getElementById("home-team");

    const away =
        document.getElementById("away-team");

    const result =
        document.getElementById("analysis-result");


    if (
        !competition ||
        !season ||
        !home ||
        !away ||
        !result
    ) {

        console.error(
            "Analysis elements missing."
        );

        return;
    }


    if (
        !competition.value ||
        !season.value ||
        !home.value ||
        !away.value
    ) {

        result.innerHTML = `

            <div class="prediction-box">

                <h3>
                    ⚠️ Complete your selections
                </h3>

                <p>
                    Select country, competition,
                    season, home team and away team.
                </p>

            </div>

        `;

        return;
    }


    if (
        home.value === away.value
    ) {

        result.innerHTML = `

            <div class="prediction-box">

                <h3>
                    ⚠️ Invalid Match
                </h3>

                <p>
                    Home and away teams
                    must be different.
                </p>

            </div>

        `;

        return;
    }


    const homeName =
        home.options[
            home.selectedIndex
        ].text;


    const awayName =
        away.options[
            away.selectedIndex
        ].text;


    result.innerHTML = `

        <div class="prediction-box">

            <h2>
                🧠 OGWEYOJR ANALYZING
            </h2>

            <h3>
                ${homeName}
                vs
                ${awayName}
            </h3>

            <p>
                ⏳ Collecting football statistics...
            </p>

        </div>

    `;


    console.log(
        "================================"
    );

    console.log(
        "OGWEYOJR MATCH ANALYSIS"
    );

    console.log(
        `${homeName} vs ${awayName}`
    );

    console.log(
        "================================"
    );


    // --------------------------------------------------------
    // FETCH DATA
    // --------------------------------------------------------

    const [
        homeFixtures,
        awayFixtures,
        h2hFixtures
    ] = await Promise.all([

        getRecentFixtures(
            home.value
        ),

        getRecentFixtures(
            away.value
        ),

        getHeadToHead(
            home.value,
            away.value
        )

    ]);


    // --------------------------------------------------------
    // CALCULATE FORM
    // --------------------------------------------------------

    const homeForm =
        calculateForm(
            homeFixtures,
            home.value
        );


    const awayForm =
        calculateForm(
            awayFixtures,
            away.value
        );


    // --------------------------------------------------------
    // HOME / AWAY
    // --------------------------------------------------------

    const homeVenue =
        calculateVenueForm(
            homeFixtures,
            home.value,
            "home"
        );


    const awayVenue =
        calculateVenueForm(
            awayFixtures,
            away.value,
            "away"
        );


    // --------------------------------------------------------
    // H2H
    // --------------------------------------------------------

    const h2h =
        calculateH2H(
            h2hFixtures,
            home.value,
            away.value
        );


    // --------------------------------------------------------
    // EXPECTED GOALS
    // --------------------------------------------------------

    const expectedGoals =
        calculateExpectedGoals(
            homeForm,
            awayForm,
            homeVenue,
            awayVenue
        );


    // --------------------------------------------------------
    // PROBABILITIES
    // --------------------------------------------------------

    let probabilities =
        calculateProbabilities(
            expectedGoals.homeXG,
            expectedGoals.awayXG
        );


    probabilities =
        normalizeProbabilities(
            probabilities
        );


    // --------------------------------------------------------
    // FINAL PREDICTION
    // --------------------------------------------------------

    const prediction =
        getFinalPrediction(
            probabilities,
            homeName,
            awayName
        );


    // --------------------------------------------------------
    // RESULT
    // --------------------------------------------------------

    result.innerHTML = `

        <div class="prediction-box">

            <h2>
                🧠 OGWEYOJR MATCH ANALYSIS
            </h2>

            <h3>
                ${homeName}
                vs
                ${awayName}
            </h3>

            <p>
                🏆 Competition:
                <strong>
                    ${
                        selectedCompetition
                            ? selectedCompetition.league.name
                            : "Unknown"
                    }
                </strong>
            </p>

            <p>
                📅 Season:
                <strong>
                    ${season.value}
                </strong>
            </p>

            <hr>


            ${teamAnalysisHTML(
                homeName,
                homeForm
            )}


            <hr>


            ${teamAnalysisHTML(
                awayName,
                awayForm
            )}


            <hr>


            ${venueHTML(
                homeName,
                awayName,
                homeVenue,
                awayVenue
            )}


            <hr>


            ${h2hHTML(
                homeName,
                awayName,
                h2h
            )}


            <hr>


            <div class="expected-goals">

                <h3>
                    📈 Expected Goals
                </h3>

                <p>
                    🏠 ${homeName}:
                    <strong>
                        ${expectedGoals.homeXG.toFixed(2)}
                    </strong>
                </p>

                <p>
                    ✈️ ${awayName}:
                    <strong>
                        ${expectedGoals.awayXG.toFixed(2)}
                    </strong>
                </p>

                <p>
                    Total Expected Goals:
                    <strong>
                        ${
                            (
                                expectedGoals.homeXG +
                                expectedGoals.awayXG
                            ).toFixed(2)
                        }
                    </strong>
                </p>

            </div>


            <hr>


            ${probabilityHTML(
                homeName,
                awayName,
                probabilities
            )}


            <hr>


            <div class="final-prediction">

                <h2>
                    🎯 OGWEYOJR FINAL TIP
                </h2>

                <h3>
                    ${prediction.prediction}
                </h3>

                <p>
                    Probability:
                    <strong>
                        ${prediction.probability.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    Confidence:
                    <strong>
                        ${prediction.confidence}
                    </strong>
                </p>

            </div>


            <hr>


            <div class="markets">

                <h3>
                    🎯 Recommended Markets
                </h3>

                <p>
                    Over 1.5:
                    <strong>
                        ${probabilities.over15.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    Over 2.5:
                    <strong>
                        ${probabilities.over25.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    Over 3.5:
                    <strong>
                        ${probabilities.over35.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    BTTS:
                    <strong>
                        ${probabilities.btts.toFixed(1)}%
                    </strong>
                </p>

            </div>


            <hr>


            <div class="responsible">

                ⚠️ Predictions are statistical
                estimates, not guaranteed results.

                <br><br>

                Bet responsibly.

            </div>

        </div>

    `;


    console.log(
        "OGWEYOJR ANALYSIS COMPLETE"
    );

}


```javascript
// ============================================================
// APPLICATION START
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("==============================");
    console.log("OGWEYOJR TIPS STARTING");
    console.log("==============================");

    const country = document.getElementById("country");
    const competition = document.getElementById("competition");
    const season = document.getElementById("season");
    const analyzeButton = document.getElementById("analyze-btn");

    if (
        !country ||
        !competition ||
        !season ||
        !analyzeButton
    ) {
        console.error(
            "Required HTML elements are missing."
        );
        return;
    }

    country.addEventListener(
        "change",
        showCompetitions
    );

    competition.addEventListener(
        "change",
        competitionChanged
    );

    season.addEventListener(
        "change",
        seasonChanged
    );

    analyzeButton.addEventListener(
        "click",
        analyzeMatch
    );

    await loadCountries();

    await loadCompetitions();

    console.log(
        "🌍 WORLDWIDE FOOTBALL SYSTEM READY"
    );

});
```

// ============================================================
// GET LAST MATCHES
// ============================================================

async function getLastMatches(teamId) {

    const data = await apiRequest(
        `/fixtures?team=${teamId}&last=10`
    );

    if (
        !data ||
        !Array.isArray(data.response)
    ) {

        return [];
    }

    return data.response;
}


// ============================================================
// CALCULATE TEAM FORM
// ============================================================

function calculateTeamForm(
    fixtures,
    teamId
) {

    let wins = 0;
    let draws = 0;
    let losses = 0;

    let goalsFor = 0;
    let goalsAgainst = 0;

    let cleanSheets = 0;

    let over15 = 0;
    let over25 = 0;
    let btts = 0;

    const form = [];


    fixtures.forEach(match => {

        const homeId =
            Number(match.teams.home.id);

        const awayId =
            Number(match.teams.away.id);

        const homeGoals =
            Number(match.goals.home);

        const awayGoals =
            Number(match.goals.away);


        if (
            !Number.isFinite(homeGoals) ||
            !Number.isFinite(awayGoals)
        ) {
            return;
        }


        const isHome =
            homeId === Number(teamId);


        const isAway =
            awayId === Number(teamId);


        if (
            !isHome &&
            !isAway
        ) {
            return;
        }


        let scored;
        let conceded;


        if (isHome) {

            scored = homeGoals;
            conceded = awayGoals;

        } else {

            scored = awayGoals;
            conceded = homeGoals;
        }


        goalsFor += scored;

        goalsAgainst += conceded;


        if (scored > conceded) {

            wins++;

            form.push("W");

        } else if (
            scored === conceded
        ) {

            draws++;

            form.push("D");

        } else {

            losses++;

            form.push("L");
        }


        if (conceded === 0) {

            cleanSheets++;
        }


        if (
            scored + conceded >= 2
        ) {

            over15++;
        }


        if (
            scored + conceded >= 3
        ) {

            over25++;
        }


        if (
            scored > 0 &&
            conceded > 0
        ) {

            btts++;
        }

    });


    const matches =
        wins +
        draws +
        losses;


    if (matches === 0) {

        return {

            matches: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            averageGoals: 0,
            averageConceded: 0,
            cleanSheetRate: 0,
            over15Rate: 0,
            over25Rate: 0,
            bttsRate: 0,
            form: "N/A"
        };
    }


    return {

        matches,

        wins,

        draws,

        losses,

        goalsFor,

        goalsAgainst,

        averageGoals:
            goalsFor / matches,

        averageConceded:
            goalsAgainst / matches,

        cleanSheetRate:
            cleanSheets / matches * 100,

        over15Rate:
            over15 / matches * 100,

        over25Rate:
            over25 / matches * 100,

        bttsRate:
            btts / matches * 100,

        form:
            form.join(" ")
    };
}


// ============================================================
// FORM SCORE
// ============================================================

function calculateFormScore(form) {

    if (!form || form.matches === 0) {

        return 50;
    }


    const winPoints =
        form.wins * 3;

    const drawPoints =
        form.draws;

    const maximum =
        form.matches * 3;


    return (
        (winPoints + drawPoints) /
        maximum
    ) * 100;
}


// ============================================================
// ATTACK SCORE
// ============================================================

function calculateAttackScore(form) {

    if (
        !form ||
        form.matches === 0
    ) {

        return 50;
    }


    const average =
        form.averageGoals;


    // Approximate scoring scale.
    const score =
        Math.min(
            100,
            average / 3 * 100
        );


    return score;
}


// ============================================================
// DEFENCE SCORE
// ============================================================

function calculateDefenseScore(form) {

    if (
        !form ||
        form.matches === 0
    ) {

        return 50;
    }


    const conceded =
        form.averageConceded;


    const score =
        Math.max(
            0,
            Math.min(
                100,
                100 -
                conceded / 3 * 100
            )
        );


    return score;
}


// ============================================================
// HOME ADVANTAGE
// ============================================================

function calculateHomeAdvantage() {

    return 7;
}


// ============================================================
// OVERALL TEAM POWER
// ============================================================

function calculateTeamPower(
    form,
    isHome
) {

    const formScore =
        calculateFormScore(form);


    const attackScore =
        calculateAttackScore(form);


    const defenseScore =
        calculateDefenseScore(form);


    let power =

        formScore * 0.45 +

        attackScore * 0.30 +

        defenseScore * 0.25;


    if (isHome) {

        power +=
            calculateHomeAdvantage();
    }


    return Math.min(
        100,
        power
    );
}


// ============================================================
// PREDICTION ENGINE
// ============================================================

function runOgweyojrPrediction(
    homeForm,
    awayForm
) {

    const homePower =
        calculateTeamPower(
            homeForm,
            true
        );


    const awayPower =
        calculateTeamPower(
            awayForm,
            false
        );


    const totalPower =
        homePower +
        awayPower;


    let homeProbability =
        homePower /
        totalPower *
        100;


    let awayProbability =
        awayPower /
        totalPower *
        100;


    // Reserve some probability for draw.
    const drawProbability =
        24;


    homeProbability =
        homeProbability *
        0.76;


    awayProbability =
        awayProbability *
        0.76;


    return {

        homePower,

        awayPower,

        homeProbability,

        drawProbability,

        awayProbability
    };
}


// ============================================================
// PREDICTION LABEL
// ============================================================

function getPredictionLabel(
    probabilities,
    homeName,
    awayName
) {

    const values = [

        {
            name: homeName,
            value:
                probabilities.homeProbability
        },

        {
            name: "Draw",
            value:
                probabilities.drawProbability
        },

        {
            name: awayName,
            value:
                probabilities.awayProbability
        }

    ];


    values.sort(
        (a, b) =>
            b.value - a.value
    );


    const winner =
        values[0];


    let confidence =
        "Low";


    if (
        winner.value >= 65
    ) {

        confidence =
            "Very High";

    } else if (
        winner.value >= 55
    ) {

        confidence =
            "High";

    } else if (
        winner.value >= 45
    ) {

        confidence =
            "Medium";
    }


    return {

        prediction:
            winner.name === "Draw"
                ? "Draw"
                : `${winner.name} to Win`,

        confidence,

        probability:
            winner.value
    };
}


// ============================================================
// SERIOUS ANALYSIS
// ============================================================

async function runSeriousAnalysis() {

    const competition =
        document.getElementById(
            "competition"
        );

    const season =
        document.getElementById(
            "season"
        );

    const home =
        document.getElementById(
            "home-team"
        );

    const away =
        document.getElementById(
            "away-team"
        );

    const result =
        document.getElementById(
            "analysis-result"
        );


    if (
        !competition ||
        !season ||
        !home ||
        !away ||
        !result
    ) {

        console.error(
            "Prediction engine elements missing."
        );

        return;
    }


    if (
        !home.value ||
        !away.value
    ) {

        result.innerHTML = `

            <h3>
                ⚠️ Select both teams first.
            </h3>

        `;

        return;
    }


    const homeName =
        home.options[
            home.selectedIndex
        ].text;


    const awayName =
        away.options[
            away.selectedIndex
        ].text;


    result.innerHTML = `

        <div class="prediction-box">

            <h2>
                🧠 OGWEYOJR PREDICTION ENGINE
            </h2>

            <p>
                Analyzing the last 10 matches...
            </p>

            <p>
                ${homeName}
                vs
                ${awayName}
            </p>

        </div>

    `;


    console.log(
        "================================"
    );

    console.log(
        "🧠 OGWEYOJR SERIOUS ENGINE"
    );

    console.log(
        `${homeName} vs ${awayName}`
    );

    console.log(
        "================================"
    );


    // --------------------------------------------------------
    // LOAD RECENT MATCHES
    // --------------------------------------------------------

    const [
        homeFixtures,
        awayFixtures
    ] = await Promise.all([

        getLastMatches(
            home.value
        ),

        getLastMatches(
            away.value
        )

    ]);


    console.log(
        "Home fixtures:",
        homeFixtures.length
    );


    console.log(
        "Away fixtures:",
        awayFixtures.length
    );


    // --------------------------------------------------------
    // FORM
    // --------------------------------------------------------

    const homeForm =
        calculateTeamForm(
            homeFixtures,
            home.value
        );


    const awayForm =
        calculateTeamForm(
            awayFixtures,
            away.value
        );


    // --------------------------------------------------------
    // PREDICTION
    // --------------------------------------------------------

    const probabilities =
        runOgweyojrPrediction(
            homeForm,
            awayForm
        );


    const finalPrediction =
        getPredictionLabel(
            probabilities,
            homeName,
            awayName
        );


    // --------------------------------------------------------
    // DISPLAY
    // --------------------------------------------------------

    result.innerHTML = `

        <div class="prediction-box">

            <h2>
                🧠 OGWEYOJR PREDICTION
            </h2>

            <h3>
                ${homeName}
                vs
                ${awayName}
            </h3>


            <hr>


            <div class="form-card">

                <h3>
                    🔥 ${homeName}
                </h3>

                <p>
                    Form:
                    <strong>
                        ${homeForm.form}
                    </strong>
                </p>

                <p>
                    Wins:
                    <strong>
                        ${homeForm.wins}
                    </strong>

                    |

                    Draws:
                    <strong>
                        ${homeForm.draws}
                    </strong>

                    |

                    Losses:
                    <strong>
                        ${homeForm.losses}
                    </strong>
                </p>

                <p>
                    ⚽ Average Goals:
                    <strong>
                        ${homeForm.averageGoals.toFixed(2)}
                    </strong>
                </p>

                <p>
                    🛡️ Average Conceded:
                    <strong>
                        ${homeForm.averageConceded.toFixed(2)}
                    </strong>
                </p>

                <p>
                    🧤 Clean Sheet Rate:
                    <strong>
                        ${homeForm.cleanSheetRate.toFixed(1)}%
                    </strong>
                </p>

            </div>


            <hr>


            <div class="form-card">

                <h3>
                    🔥 ${awayName}
                </h3>

                <p>
                    Form:
                    <strong>
                        ${awayForm.form}
                    </strong>
                </p>

                <p>
                    Wins:
                    <strong>
                        ${awayForm.wins}
                    </strong>

                    |

                    Draws:
                    <strong>
                        ${awayForm.draws}
                    </strong>

                    |

                    Losses:
                    <strong>
                        ${awayForm.losses}
                    </strong>
                </p>

                <p>
                    ⚽ Average Goals:
                    <strong>
                        ${awayForm.averageGoals.toFixed(2)}
                    </strong>
                </p>

                <p>
                    🛡️ Average Conceded:
                    <strong>
                        ${awayForm.averageConceded.toFixed(2)}
                    </strong>
                </p>

                <p>
                    🧤 Clean Sheet Rate:
                    <strong>
                        ${awayForm.cleanSheetRate.toFixed(1)}%
                    </strong>
                </p>

            </div>


            <hr>


            <div class="probability-section">

                <h3>
                    📊 Win Probabilities
                </h3>

                <p>
                    🏠 ${homeName}:
                    <strong>
                        ${probabilities.homeProbability.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    🤝 Draw:
                    <strong>
                        ${probabilities.drawProbability.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    ✈️ ${awayName}:
                    <strong>
                        ${probabilities.awayProbability.toFixed(1)}%
                    </strong>
                </p>

            </div>


            <hr>


            <div class="final-prediction">

                <h2>
                    🎯 OGWEYOJR FINAL TIP
                </h2>

                <h3>
                    ${finalPrediction.prediction}
                </h3>

                <p>
                    Probability:
                    <strong>
                        ${finalPrediction.probability.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    Confidence:
                    <strong>
                        ${finalPrediction.confidence}
                    </strong>
                </p>

            </div>


            <hr>


            <p>
                ⚠️ Predictions are statistical estimates,
                not guaranteed outcomes.
            </p>

            <p>
                Bet responsibly.
            </p>

        </div>

    `;


    console.log(
        "🎯 FINAL:",
        finalPrediction
    );


    console.log(
        "✅ SERIOUS PREDICTION COMPLETE"
    );
}


// ============================================================
// CONNECT ENGINE TO ANALYZE BUTTON
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const button =
            document.getElementById(
                "analyze-btn"
            );


        if (!button) {

            console.warn(
                "Analyze button not found."
            );

            return;
        }


        button.addEventListener(
            "click",
            runSeriousAnalysis
        );


        console.log(
            "🎯 Serious prediction engine connected."
        );

    }
);// ============================================================
// OGWEYOJR WEIGHTED FORM ENGINE
// ============================================================

function calculateWeightedForm(fixtures, teamId) {

    if (!fixtures || fixtures.length === 0) {
        return {
            score: 50,
            recentForm: "N/A"
        };
    }

    const validMatches = fixtures
        .filter(match => {

            if (!match.goals) return false;

            const homeId = Number(match.teams.home.id);
            const awayId = Number(match.teams.away.id);

            return (
                homeId === Number(teamId) ||
                awayId === Number(teamId)
            );
        })
        .slice(0, 10);


    if (validMatches.length === 0) {
        return {
            score: 50,
            recentForm: "N/A"
        };
    }


    let weightedPoints = 0;
    let maximumPoints = 0;

    const form = [];


    validMatches.forEach((match, index) => {

        const homeId = Number(match.teams.home.id);
        const awayId = Number(match.teams.away.id);

        const homeGoals = Number(match.goals.home);
        const awayGoals = Number(match.goals.away);

        const isHome =
            homeId === Number(teamId);

        const scored =
            isHome ? homeGoals : awayGoals;

        const conceded =
            isHome ? awayGoals : homeGoals;


        let points = 0;
        let letter = "L";


        if (scored > conceded) {

            points = 3;
            letter = "W";

        } else if (scored === conceded) {

            points = 1;
            letter = "D";

        }


        // Newer matches receive more weight.
        const weight =
            validMatches.length - index;


        weightedPoints +=
            points * weight;

        maximumPoints +=
            3 * weight;


        form.push(letter);

    });


    const score =
        maximumPoints > 0
            ? (weightedPoints / maximumPoints) * 100
            : 50;


    return {

        score,

        recentForm:
            form.join(" ")

    };
}


// ============================================================
// ATTACK STRENGTH
// ============================================================

function calculateAttackStrength(
    fixtures,
    teamId
) {

    if (!fixtures || fixtures.length === 0) {
        return 50;
    }


    let goals = 0;
    let matches = 0;


    fixtures.forEach(match => {

        const homeId =
            Number(match.teams.home.id);

        const awayId =
            Number(match.teams.away.id);


        if (
            homeId !== Number(teamId) &&
            awayId !== Number(teamId)
        ) {
            return;
        }


        const homeGoals =
            Number(match.goals.home);

        const awayGoals =
            Number(match.goals.away);


        if (
            !Number.isFinite(homeGoals) ||
            !Number.isFinite(awayGoals)
        ) {
            return;
        }


        if (homeId === Number(teamId)) {

            goals += homeGoals;

        } else {

            goals += awayGoals;
        }


        matches++;

    });


    if (matches === 0) {
        return 50;
    }


    const average =
        goals / matches;


    return Math.min(
        100,
        average / 3 * 100
    );
}


// ============================================================
// DEFENCE STRENGTH
// ============================================================

function calculateDefenceStrength(
    fixtures,
    teamId
) {

    if (!fixtures || fixtures.length === 0) {
        return 50;
    }


    let conceded = 0;
    let matches = 0;


    fixtures.forEach(match => {

        const homeId =
            Number(match.teams.home.id);

        const awayId =
            Number(match.teams.away.id);


        if (
            homeId !== Number(teamId) &&
            awayId !== Number(teamId)
        ) {
            return;
        }


        const homeGoals =
            Number(match.goals.home);

        const awayGoals =
            Number(match.goals.away);


        if (
            !Number.isFinite(homeGoals) ||
            !Number.isFinite(awayGoals)
        ) {
            return;
        }


        if (homeId === Number(teamId)) {

            conceded += awayGoals;

        } else {

            conceded += homeGoals;
        }


        matches++;

    });


    if (matches === 0) {
        return 50;
    }


    const average =
        conceded / matches;


    return Math.max(
        0,
        100 - (average / 3 * 100)
    );
}


// ============================================================
// FINAL TEAM STRENGTH
// ============================================================

function calculateWeightedTeamStrength(
    fixtures,
    teamId,
    isHome
) {

    const weightedForm =
        calculateWeightedForm(
            fixtures,
            teamId
        );


    const attack =
        calculateAttackStrength(
            fixtures,
            teamId
        );


    const defence =
        calculateDefenceStrength(
            fixtures,
            teamId
        );


    let strength =

        weightedForm.score * 0.50 +

        attack * 0.25 +

        defence * 0.25;


    // Home advantage
    if (isHome) {
        strength += 7;
    }


    return {

        strength:
            Math.min(100, strength),

        form:
            weightedForm.score,

        attack,

        defence,

        recentForm:
            weightedForm.recentForm

    };
}


// ============================================================
// ADVANCED PREDICTION
// ============================================================

function calculateAdvancedPrediction(
    homeFixtures,
    awayFixtures,
    homeId,
    awayId,
    homeName,
    awayName
) {

    const home =
        calculateWeightedTeamStrength(
            homeFixtures,
            homeId,
            true
        );


    const away =
        calculateWeightedTeamStrength(
            awayFixtures,
            awayId,
            false
        );


    const total =
        home.strength +
        away.strength;


    if (total <= 0) {

        return null;
    }


    let homeWin =
        home.strength /
        total *
        100;


    let awayWin =
        away.strength /
        total *
        100;


    // Reserve probability for draws.
    const draw =
        24;


    const remaining =
        100 - draw;


    const teamTotal =
        homeWin +
        awayWin;


    homeWin =
        homeWin /
        teamTotal *
        remaining;


    awayWin =
        awayWin /
        teamTotal *
        remaining;


    const possibilities = [

        {
            name: homeName,
            probability: homeWin
        },

        {
            name: "Draw",
            probability: draw
        },

        {
            name: awayName,
            probability: awayWin
        }

    ];


    possibilities.sort(
        (a, b) =>
            b.probability -
            a.probability
    );


    const best =
        possibilities[0];


    let confidence =
        "Low";


    if (
        best.probability >= 65
    ) {

        confidence = "Very High";

    } else if (
        best.probability >= 55
    ) {

        confidence = "High";

    } else if (
        best.probability >= 45
    ) {

        confidence = "Medium";
    }


    return {

        home,

        away,

        homeWin,

        draw,

        awayWin,

        prediction:
            best.name === "Draw"
                ? "Draw"
                : `${best.name} to Win`,

        probability:
            best.probability,

        confidence

    };
}


// ============================================================
// TEST ADVANCED ENGINE
// ============================================================

console.log(
    "🔥 OGWEYOJR WEIGHTED PREDICTION ENGINE READY"
);// ============================================================
// CONNECT ADVANCED ENGINE TO ANALYZE BUTTON
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const analyzeButton =
        document.getElementById("analyze-btn");

    if (!analyzeButton) {
        console.warn(
            "⚠️ Analyze button not found."
        );
        return;
    }

    analyzeButton.addEventListener(
        "click",
        async function () {

            const homeSelect =
                document.getElementById("home-team");

            const awaySelect =
                document.getElementById("away-team");

            const competitionSelect =
                document.getElementById("competition");

            const seasonSelect =
                document.getElementById("season");

            const result =
                document.getElementById("analysis-result");


            if (
                !homeSelect ||
                !awaySelect ||
                !competitionSelect ||
                !seasonSelect ||
                !result
            ) {

                console.error(
                    "❌ Prediction elements missing."
                );

                return;
            }


            const homeId =
                homeSelect.value;

            const awayId =
                awaySelect.value;

            const leagueId =
                competitionSelect.value;

            const season =
                seasonSelect.value;


            if (!homeId || !awayId) {

                result.innerHTML = `
                    <h3>⚠️ Select both teams first.</h3>
                `;

                return;
            }


            if (homeId === awayId) {

                result.innerHTML = `
                    <h3>
                        ⚠️ Please select two different teams.
                    </h3>
                `;

                return;
            }


            const homeName =
                homeSelect.options[
                    homeSelect.selectedIndex
                ].text;


            const awayName =
                awaySelect.options[
                    awaySelect.selectedIndex
                ].text;


            result.innerHTML = `
                <div class="prediction-box">

                    <h2>
                        🧠 OGWEYOJR ANALYZING
                    </h2>

                    <p>
                        ${homeName}
                        vs
                        ${awayName}
                    </p>

                    <p>
                        Loading statistical data...
                    </p>

                </div>
            `;


            console.log(
                "================================"
            );

            console.log(
                "🧠 ADVANCED OGWEYOJR ANALYSIS"
            );

            console.log(
                `${homeName} vs ${awayName}`
            );

            console.log(
                "League:",
                leagueId
            );

            console.log(
                "Season:",
                season
            );


            try {

                // --------------------------------------------
                // LOAD LAST 10 MATCHES
                // --------------------------------------------

                const [
                    homeFixtures,
                    awayFixtures
                ] = await Promise.all([

                    getLastMatches(homeId),

                    getLastMatches(awayId)

                ]);


                console.log(
                    "Home matches:",
                    homeFixtures.length
                );

                console.log(
                    "Away matches:",
                    awayFixtures.length
                );


                // --------------------------------------------
                // RUN ADVANCED ENGINE
                // --------------------------------------------

                const prediction =
                    calculateAdvancedPrediction(

                        homeFixtures,

                        awayFixtures,

                        homeId,

                        awayId,

                        homeName,

                        awayName

                    );


                if (!prediction) {

                    result.innerHTML = `
                        <h3>
                            ⚠️ Not enough data
                        </h3>

                        <p>
                            The API did not return
                            enough match data for
                            this prediction.
                        </p>
                    `;

                    return;
                }


                // --------------------------------------------
                // DISPLAY RESULT
                // --------------------------------------------

                result.innerHTML = `

                    <div class="prediction-box">

                        <h2>
                            🧠 OGWEYOJR MATCH ANALYSIS
                        </h2>


                        <h3>
                            ${homeName}
                            vs
                            ${awayName}
                        </h3>


                        <hr>


                        <h3>
                            🔥 ${homeName}
                        </h3>

                        <p>
                            Recent Form:
                            <strong>
                                ${prediction.home.recentForm}
                            </strong>
                        </p>

                        <p>
                            Form Strength:
                            <strong>
                                ${prediction.home.form.toFixed(1)}%
                            </strong>
                        </p>

                        <p>
                            ⚽ Attack:
                            <strong>
                                ${prediction.home.attack.toFixed(1)}%
                            </strong>
                        </p>

                        <p>
                            🛡️ Defence:
                            <strong>
                                ${prediction.home.defence.toFixed(1)}%
                            </strong>
                        </p>


                        <hr>


                        <h3>
                            🔥 ${awayName}
                        </h3>

                        <p>
                            Recent Form:
                            <strong>
                                ${prediction.away.recentForm}
                            </strong>
                        </p>

                        <p>
                            Form Strength:
                            <strong>
                                ${prediction.away.form.toFixed(1)}%
                            </strong>
                        </p>

                        <p>
                            ⚽ Attack:
                            <strong>
                                ${prediction.away.attack.toFixed(1)}%
                            </strong>
                        </p>

                        <p>
                            🛡️ Defence:
                            <strong>
                                ${prediction.away.defence.toFixed(1)}%
                            </strong>
                        </p>


                        <hr>


                        <h3>
                            📊 WIN PROBABILITIES
                        </h3>

                        <p>
                            🏠 ${homeName}:
                            <strong>
                                ${prediction.homeWin.toFixed(1)}%
                            </strong>
                        </p>

                        <p>
                            🤝 Draw:
                            <strong>
                                ${prediction.draw.toFixed(1)}%
                            </strong>
                        </p>

                        <p>
                            ✈️ ${awayName}:
                            <strong>
                                ${prediction.awayWin.toFixed(1)}%
                            </strong>
                        </p>


                        <hr>


                        <div class="final-prediction">

                            <h2>
                                🎯 OGWEYOJR FINAL TIP
                            </h2>

                            <h3>
                                ${prediction.prediction}
                            </h3>

                            <p>
                                Probability:
                                <strong>
                                    ${prediction.probability.toFixed(1)}%
                                </strong>
                            </p>

                            <p>
                                Confidence:
                                <strong>
                                    ${prediction.confidence}
                                </strong>
                            </p>

                        </div>


                        <hr>


                        <p>
                            ⚠️ Statistical prediction only.
                            No result is guaranteed.
                        </p>

                        <p>
                            <strong>
                                Bet responsibly.
                            </strong>
                        </p>

                    </div>
                `;


                console.log(
                    "🎯 OGWEYOJR PREDICTION:",
                    prediction
                );

                console.log(
                    "✅ ADVANCED ANALYSIS COMPLETE"
                );


            } catch (error) {

                console.error(
                    "❌ Prediction error:",
                    error
                );


                result.innerHTML = `

                    <div class="prediction-box">

                        <h3>
                            ⚠️ Analysis failed
                        </h3>

                        <p>
                            We couldn't retrieve enough
                            data for this match.
                        </p>

                        <p>
                            Please try another match.
                        </p>

                    </div>

                `;
            }

        }
    );

});// ============================================================
// OGWEYOJR GOALS & MARKETS ENGINE
// ============================================================

function calculateGoalsMarkets(homeFixtures, awayFixtures, homeId, awayId) {

    function getTeamGoalData(fixtures, teamId) {

        let scored = 0;
        let conceded = 0;
        let matches = 0;
        let over15 = 0;
        let over25 = 0;
        let over35 = 0;
        let btts = 0;
        let cleanSheets = 0;

        fixtures.forEach(match => {

            const homeTeam =
                Number(match.teams.home.id);

            const awayTeam =
                Number(match.teams.away.id);

            if (
                homeTeam !== Number(teamId) &&
                awayTeam !== Number(teamId)
            ) {
                return;
            }

            const homeGoals =
                Number(match.goals.home);

            const awayGoals =
                Number(match.goals.away);

            if (
                !Number.isFinite(homeGoals) ||
                !Number.isFinite(awayGoals)
            ) {
                return;
            }

            let teamScored;
            let teamConceded;

            if (homeTeam === Number(teamId)) {
                teamScored = homeGoals;
                teamConceded = awayGoals;
            } else {
                teamScored = awayGoals;
                teamConceded = homeGoals;
            }

            scored += teamScored;
            conceded += teamConceded;
            matches++;

            const totalGoals =
                homeGoals + awayGoals;

            if (totalGoals >= 2) {
                over15++;
            }

            if (totalGoals >= 3) {
                over25++;
            }

            if (totalGoals >= 4) {
                over35++;
            }

            if (
                homeGoals > 0 &&
                awayGoals > 0
            ) {
                btts++;
            }

            if (teamConceded === 0) {
                cleanSheets++;
            }
        });

        if (matches === 0) {
            return {
                matches: 0,
                averageScored: 0,
                averageConceded: 0,
                over15: 0,
                over25: 0,
                over35: 0,
                btts: 0,
                cleanSheet: 0
            };
        }

        return {
            matches,

            averageScored:
                scored / matches,

            averageConceded:
                conceded / matches,

            over15:
                over15 / matches * 100,

            over25:
                over25 / matches * 100,

            over35:
                over35 / matches * 100,

            btts:
                btts / matches * 100,

            cleanSheet:
                cleanSheets / matches * 100
        };
    }


    const home =
        getTeamGoalData(
            homeFixtures,
            homeId
        );

    const away =
        getTeamGoalData(
            awayFixtures,
            awayId
        );


    // --------------------------------------------------------
    // EXPECTED GOALS
    // --------------------------------------------------------

    const homeExpectedGoals =
        (
            home.averageScored +
            away.averageConceded
        ) / 2;


    const awayExpectedGoals =
        (
            away.averageScored +
            home.averageConceded
        ) / 2;


    const expectedTotal =
        homeExpectedGoals +
        awayExpectedGoals;


    // --------------------------------------------------------
    // MARKET PROBABILITIES
    // --------------------------------------------------------

    const over15 =
        (
            home.over15 +
            away.over15
        ) / 2;


    const over25 =
        (
            home.over25 +
            away.over25
        ) / 2;


    const over35 =
        (
            home.over35 +
            away.over35
        ) / 2;


    const btts =
        (
            home.btts +
            away.btts
        ) / 2;


    const cleanSheetHome =
        home.cleanSheet;


    const cleanSheetAway =
        away.cleanSheet;


    // --------------------------------------------------------
    // CORRECT SCORE ESTIMATE
    // --------------------------------------------------------

    function estimateScore(
        homeGoals,
        awayGoals
    ) {

        const h =
            Math.max(
                0,
                Math.min(
                    5,
                    Math.round(homeGoals)
                )
            );

        const a =
            Math.max(
                0,
                Math.min(
                    5,
                    Math.round(awayGoals)
                )
            );

        return `${h}-${a}`;
    }


    const likelyScore =
        estimateScore(
            homeExpectedGoals,
            awayExpectedGoals
        );


    // --------------------------------------------------------
    // MARKET SELECTION
    // --------------------------------------------------------

    let strongestMarket =
        "No strong market";


    let strongestProbability = 0;


    const markets = [

        {
            name: "Over 1.5 Goals",
            probability: over15
        },

        {
            name: "Over 2.5 Goals",
            probability: over25
        },

        {
            name: "Over 3.5 Goals",
            probability: over35
        },

        {
            name: "Both Teams To Score",
            probability: btts
        }

    ];


    markets.forEach(market => {

        if (
            market.probability >
            strongestProbability
        ) {

            strongestProbability =
                market.probability;

            strongestMarket =
                market.name;
        }

    });


    return {

        home,
        away,

        homeExpectedGoals,

        awayExpectedGoals,

        expectedTotal,

        over15,

        over25,

        over35,

        btts,

        cleanSheetHome,

        cleanSheetAway,

        likelyScore,

        strongestMarket,

        strongestProbability

    };
}


// ============================================================
// DISPLAY GOALS MARKETS
// ============================================================

function displayGoalsMarkets(
    markets,
    homeName,
    awayName,
    resultElement
) {

    if (!markets) {
        return;
    }


    resultElement.innerHTML += `

        <hr>

        <div class="goals-markets">

            <h2>
                ⚽ GOALS & MARKETS
            </h2>


            <h3>
                📈 Expected Goals
            </h3>

            <p>
                ${homeName}:
                <strong>
                    ${markets.homeExpectedGoals.toFixed(2)}
                </strong>
            </p>

            <p>
                ${awayName}:
                <strong>
                    ${markets.awayExpectedGoals.toFixed(2)}
                </strong>
            </p>

            <p>
                Total Expected Goals:
                <strong>
                    ${markets.expectedTotal.toFixed(2)}
                </strong>
            </p>


            <hr>


            <h3>
                🎯 Goal Markets
            </h3>

            <p>
                Over 1.5:
                <strong>
                    ${markets.over15.toFixed(1)}%
                </strong>
            </p>

            <p>
                Over 2.5:
                <strong>
                    ${markets.over25.toFixed(1)}%
                </strong>
            </p>

            <p>
                Over 3.5:
                <strong>
                    ${markets.over35.toFixed(1)}%
                </strong>
            </p>

            <p>
                BTTS:
                <strong>
                    ${markets.btts.toFixed(1)}%
                </strong>
            </p>


            <hr>


            <h3>
                🧤 Clean Sheet
            </h3>

            <p>
                ${homeName}:
                <strong>
                    ${markets.cleanSheetHome.toFixed(1)}%
                </strong>
            </p>

            <p>
                ${awayName}:
                <strong>
                    ${markets.cleanSheetAway.toFixed(1)}%
                </strong>
            </p>


            <hr>


            <h3>
                🎯 Likely Score
            </h3>

            <p>
                <strong>
                    ${markets.likelyScore}
                </strong>
            </p>


            <hr>


            <div class="strongest-market">

                <h3>
                    🔥 STRONGEST GOALS MARKET
                </h3>

                <p>
                    <strong>
                        ${markets.strongestMarket}
                    </strong>
                </p>

                <p>
                    Estimated Probability:
                    <strong>
                        ${markets.strongestProbability.toFixed(1)}%
                    </strong>
                </p>

            </div>

        </div>
    `;
}


console.log(
    "⚽ OGWEYOJR GOALS & MARKETS ENGINE READY"
);// ============================================================
// OGWEYOJR - CONNECT GOALS & MARKETS TO ANALYSIS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const analyzeButton =
        document.getElementById("analyze-btn");

    if (!analyzeButton) {
        console.warn(
            "⚠️ Analyze button not found for Goals & Markets."
        );
        return;
    }

    analyzeButton.addEventListener("click", async function () {

        const homeSelect =
            document.getElementById("home-team");

        const awaySelect =
            document.getElementById("away-team");

        const result =
            document.getElementById("analysis-result");

        if (!homeSelect || !awaySelect || !result) {
            console.warn(
                "⚠️ Required analysis elements not found."
            );
            return;
        }

        const homeId = homeSelect.value;
        const awayId = awaySelect.value;

        if (!homeId || !awayId) {
            return;
        }

        if (homeId === awayId) {
            return;
        }

        const homeName =
            homeSelect.options[
                homeSelect.selectedIndex
            ].text;

        const awayName =
            awaySelect.options[
                awaySelect.selectedIndex
            ].text;

        console.log(
            "⚽ Loading Goals & Markets..."
        );

        try {

            const [
                homeFixtures,
                awayFixtures
            ] = await Promise.all([

                getLastMatches(homeId),

                getLastMatches(awayId)

            ]);

            const markets =
                calculateGoalsMarkets(

                    homeFixtures,

                    awayFixtures,

                    homeId,

                    awayId

                );

            if (!markets) {

                console.warn(
                    "⚠️ Goals & Markets data unavailable."
                );

                return;
            }

            displayGoalsMarkets(

                markets,

                homeName,

                awayName,

                result

            );

            console.log(
                "================================"
            );

            console.log(
                "⚽ GOALS & MARKETS COMPLETE"
            );

            console.log(
                "Expected Total:",
                markets.expectedTotal
            );

            console.log(
                "Over 1.5:",
                markets.over15
            );

            console.log(
                "Over 2.5:",
                markets.over25
            );

            console.log(
                "Over 3.5:",
                markets.over35
            );

            console.log(
                "BTTS:",
                markets.btts
            );

            console.log(
                "Likely Score:",
                markets.likelyScore
            );

            console.log(
                "Strongest Market:",
                markets.strongestMarket
            );

            console.log(
                "================================"
            );

        } catch (error) {

            console.error(
                "❌ Goals & Markets error:",
                error
            );

        }

    });

});

console.log(
    "🎯 OGWEYOJR GOALS & MARKETS CONNECTED"
);// ============================================================
// OGWEYOJR - CONNECT GOALS & MARKETS TO ANALYSIS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const analyzeButton =
        document.getElementById("analyze-btn");

    if (!analyzeButton) {
        console.warn(
            "⚠️ Analyze button not found for Goals & Markets."
        );
        return;
    }

    analyzeButton.addEventListener("click", async function () {

        const homeSelect =
            document.getElementById("home-team");

        const awaySelect =
            document.getElementById("away-team");

        const result =
            document.getElementById("analysis-result");

        if (!homeSelect || !awaySelect || !result) {
            console.warn(
                "⚠️ Required analysis elements not found."
            );
            return;
        }

        const homeId = homeSelect.value;
        const awayId = awaySelect.value;

        if (!homeId || !awayId) {
            return;
        }

        if (homeId === awayId) {
            return;
        }

        const homeName =
            homeSelect.options[
                homeSelect.selectedIndex
            ].text;

        const awayName =
            awaySelect.options[
                awaySelect.selectedIndex
            ].text;

        console.log(
            "⚽ Loading Goals & Markets..."
        );

        try {

            const [
                homeFixtures,
                awayFixtures
            ] = await Promise.all([

                getLastMatches(homeId),

                getLastMatches(awayId)

            ]);

            const markets =
                calculateGoalsMarkets(

                    homeFixtures,

                    awayFixtures,

                    homeId,

                    awayId

                );

            if (!markets) {

                console.warn(
                    "⚠️ Goals & Markets data unavailable."
                );

                return;
            }

            displayGoalsMarkets(

                markets,

                homeName,

                awayName,

                result

            );

            console.log(
                "================================"
            );

            console.log(
                "⚽ GOALS & MARKETS COMPLETE"
            );

            console.log(
                "Expected Total:",
                markets.expectedTotal
            );

            console.log(
                "Over 1.5:",
                markets.over15
            );

            console.log(
                "Over 2.5:",
                markets.over25
            );

            console.log(
                "Over 3.5:",
                markets.over35
            );

            console.log(
                "BTTS:",
                markets.btts
            );

            console.log(
                "Likely Score:",
                markets.likelyScore
            );

            console.log(
                "Strongest Market:",
                markets.strongestMarket
            );

            console.log(
                "================================"
            );

        } catch (error) {

            console.error(
                "❌ Goals & Markets error:",
                error
            );

        }

    });

});

console.log(
    "🎯 OGWEYOJR GOALS & MARKETS CONNECTED"
);// ============================================================
// OGWEYOJR PREDICTION ENGINE V2
// Combines Form + Attack + Defence + H2H + Venue + Goals
// ============================================================

function ogweyoPredictionV2({
    home,
    away,
    h2h,
    homeVenue,
    awayVenue,
    goals
}) {

    // --------------------------------------------------------
    // SAFETY DEFAULTS
    // --------------------------------------------------------

    home = home || {};
    away = away || {};
    h2h = h2h || {};
    homeVenue = homeVenue || {};
    awayVenue = awayVenue || {};
    goals = goals || {};


    // --------------------------------------------------------
    // BASIC TEAM STRENGTH
    // --------------------------------------------------------

    const homeForm =
        Number(home.form) || 50;

    const awayForm =
        Number(away.form) || 50;

    const homeAttack =
        Number(home.attack) || 50;

    const awayAttack =
        Number(away.attack) || 50;

    const homeDefence =
        Number(home.defence) || 50;

    const awayDefence =
        Number(away.defence) || 50;


    // --------------------------------------------------------
    // VENUE STRENGTH
    // --------------------------------------------------------

    const homeVenueRate =
        Number(homeVenue.winRate) || 50;

    const awayVenueRate =
        Number(awayVenue.winRate) || 50;


    // --------------------------------------------------------
    // H2H
    // --------------------------------------------------------

    const h2hHome =
        Number(h2h.homeWinRate) || 0;

    const h2hAway =
        Number(h2h.awayWinRate) || 0;

    const h2hDraw =
        Number(h2h.drawRate) || 0;


    // --------------------------------------------------------
    // GOAL EXPECTATIONS
    // --------------------------------------------------------

    const homeXG =
        Number(goals.homeExpectedGoals) || 0;

    const awayXG =
        Number(goals.awayExpectedGoals) || 0;


    // --------------------------------------------------------
    // TEAM SCORES
    // --------------------------------------------------------

    let homeScore =

        homeForm * 0.30 +

        homeAttack * 0.20 +

        homeDefence * 0.15 +

        homeVenueRate * 0.15 +

        h2hHome * 0.10 +

        Math.min(homeXG * 20, 100) * 0.10;


    let awayScore =

        awayForm * 0.30 +

        awayAttack * 0.20 +

        awayDefence * 0.15 +

        awayVenueRate * 0.15 +

        h2hAway * 0.10 +

        Math.min(awayXG * 20, 100) * 0.10;


    // --------------------------------------------------------
    // HOME ADVANTAGE
    // --------------------------------------------------------

    homeScore += 5;


    // --------------------------------------------------------
    // DIFFERENCE
    // --------------------------------------------------------

    const difference =
        homeScore - awayScore;


    // --------------------------------------------------------
    // DRAW FACTOR
    // --------------------------------------------------------

    let drawScore = 25;


    if (
        Math.abs(difference) < 5
    ) {

        drawScore += 15;

    } else if (
        Math.abs(difference) < 10
    ) {

        drawScore += 7;
    }


    // H2H draw history
    if (h2hDraw > 30) {
        drawScore += 5;
    }


    // --------------------------------------------------------
    // CONVERT TO PROBABILITIES
    // --------------------------------------------------------

    const rawHome =
        Math.max(1, homeScore);

    const rawAway =
        Math.max(1, awayScore);

    const rawDraw =
        Math.max(1, drawScore);


    const total =
        rawHome +
        rawAway +
        rawDraw;


    const homeProbability =
        rawHome / total * 100;

    const drawProbability =
        rawDraw / total * 100;

    const awayProbability =
        rawAway / total * 100;


    // --------------------------------------------------------
    // FIND BEST OUTCOME
    // --------------------------------------------------------

    let prediction;
    let probability;


    if (
        homeProbability >= drawProbability &&
        homeProbability >= awayProbability
    ) {

        prediction = "HOME WIN";
        probability = homeProbability;

    } else if (
        awayProbability >= homeProbability &&
        awayProbability >= drawProbability
    ) {

        prediction = "AWAY WIN";
        probability = awayProbability;

    } else {

        prediction = "DRAW";
        probability = drawProbability;
    }


    // --------------------------------------------------------
    // CONFIDENCE
    // --------------------------------------------------------

    let confidence = "Low";

    if (probability >= 70) {

        confidence = "Very High";

    } else if (probability >= 60) {

        confidence = "High";

    } else if (probability >= 50) {

        confidence = "Medium";
    }


    // --------------------------------------------------------
    // DOUBLE CHANCE
    // --------------------------------------------------------

    let doubleChance;


    if (
        homeProbability >= awayProbability
    ) {

        doubleChance =
            "1X — Home or Draw";

    } else {

        doubleChance =
            "X2 — Away or Draw";
    }


    // --------------------------------------------------------
    // GOAL MARKETS
    // --------------------------------------------------------

    const over25 =
        Number(goals.over25) || 0;

    const btts =
        Number(goals.btts) || 0;


    let goalsTip = "No strong goals tip";

    if (over25 >= 65) {

        goalsTip =
            "Over 2.5 Goals";

    } else if (
        over25 >= 55
    ) {

        goalsTip =
            "Over 1.5 Goals";
    }


    let bttsTip = "BTTS — Uncertain";

    if (btts >= 65) {

        bttsTip =
            "BTTS — YES";

    } else if (
        btts <= 35
    ) {

        bttsTip =
            "BTTS — NO";
    }


    // --------------------------------------------------------
    // FINAL OBJECT
    // --------------------------------------------------------

    return {

        homeProbability,

        drawProbability,

        awayProbability,

        prediction,

        probability,

        confidence,

        doubleChance,

        goalsTip,

        bttsTip,

        homeScore,

        awayScore,

        difference

    };
}


console.log(
    "🧠 OGWEYOJR PREDICTION ENGINE V2 READY"
);// ============================================================
// OGWEYOJR FINAL PREDICTION DISPLAY
// ============================================================

function displayFinalPrediction(
    prediction,
    homeName,
    awayName,
    result
) {

    if (!prediction || !result) {
        return;
    }

    const homeProb =
        prediction.homeProbability.toFixed(1);

    const drawProb =
        prediction.drawProbability.toFixed(1);

    const awayProb =
        prediction.awayProbability.toFixed(1);

    const confidence =
        prediction.confidence;

    let confidenceMessage =
        "The match requires caution.";

    if (confidence === "Very High") {
        confidenceMessage =
            "Strong statistical advantage detected.";
    } else if (confidence === "High") {
        confidenceMessage =
            "Good statistical advantage detected.";
    } else if (confidence === "Medium") {
        confidenceMessage =
            "Moderate statistical advantage detected.";
    }

    result.innerHTML += `

        <hr>

        <div class="ogweyo-final-prediction">

            <h2>
                🎯 OGWEYOJR FINAL PREDICTION
            </h2>

            <h3>
                ${homeName} vs ${awayName}
            </h3>

            <div class="prediction-main">

                <h2>
                    ${prediction.prediction}
                </h2>

                <p>
                    Probability:
                    <strong>
                        ${prediction.probability.toFixed(1)}%
                    </strong>
                </p>

                <p>
                    Confidence:
                    <strong>
                        ${confidence}
                    </strong>
                </p>

            </div>


            <hr>


            <h3>
                📊 MATCH PROBABILITIES
            </h3>

            <p>
                🏠 ${homeName} Win:
                <strong>
                    ${homeProb}%
                </strong>
            </p>

            <p>
                🤝 Draw:
                <strong>
                    ${drawProb}%
                </strong>
            </p>

            <p>
                ✈️ ${awayName} Win:
                <strong>
                    ${awayProb}%
                </strong>
            </p>


            <hr>


            <h3>
                🔐 SAFER OPTION
            </h3>

            <p>
                <strong>
                    ${prediction.doubleChance}
                </strong>
            </p>


            <h3>
                ⚽ GOALS
            </h3>

            <p>
                <strong>
                    ${prediction.goalsTip}
                </strong>
            </p>


            <h3>
                🤝 BOTH TEAMS TO SCORE
            </h3>

            <p>
                <strong>
                    ${prediction.bttsTip}
                </strong>
            </p>


            <hr>


            <p>
                🧠 ${confidenceMessage}
            </p>

            <p>
                ⚠️ This is a statistical prediction,
                not a guarantee of the match result.
            </p>

            <p>
                <strong>
                    Bet responsibly.
                </strong>
            </p>

        </div>
    `;

    console.log(
        "🎯 FINAL OGWEYOJR PREDICTION DISPLAYED"
    );
}
