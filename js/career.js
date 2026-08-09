const CAREER_DATA_URL = "./data/career.json";

document.addEventListener("DOMContentLoaded", loadCareer);

async function loadCareer() {
  const root = document.querySelector("#career-list");

  if (!root) return;

  try {
    const response = await fetch(CAREER_DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const items = await response.json();

    root.replaceChildren(
      ...items.map(renderCareerItem)
    );
  } catch (error) {
    console.error("Failed to load career:", error);

    const message = document.createElement("p");

    message.className = "load-error";

    message.textContent =
      "Career information could not be loaded. Run a local web server instead of opening index.html directly.";

    root.replaceChildren(message);
  }
}


function renderCareerItem(item) {
  const container = document.createElement("div");

  container.className = "career-item";


  // Period
  if (item.period) {
    const period = document.createElement("div");

    period.className = "career-year";

    period.textContent = item.period;

    container.appendChild(period);
  }


  // Organization
    if (item.organization) {
    const organization = document.createElement("div");

    organization.className = "career-organization";
    organization.textContent = item.organization;

    container.appendChild(organization);
    }


  // Role
  if (item.role) {
    const role = document.createElement("div");

    role.textContent = item.role;

    container.appendChild(role);
  }


  // People / Advisors
  if (
    Array.isArray(item.people) &&
    item.people.length > 0
  ) {
    const people = document.createElement("div");
    people.className = "career-people"; 

    item.people.forEach((person, index) => {

      if (person.url) {
        const link = document.createElement("a");

        link.href = person.url;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        link.textContent = person.name;

        people.appendChild(link);
      } else {
        people.appendChild(
          document.createTextNode(
            person.name ?? ""
          )
        );
      }


      if (index < item.people.length - 1) {
        people.appendChild(
          document.createTextNode(", ")
        );
      }
    });


    container.appendChild(people);
  }


  return container;
}