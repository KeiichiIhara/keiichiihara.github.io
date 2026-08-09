const DATA_URL = "./data/publications.json";

document.addEventListener("DOMContentLoaded", loadPublications);

async function loadPublications() {
  const root = document.querySelector("#publication-list");

  if (!root) return;

  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const groups = await response.json();

    root.replaceChildren(
      ...groups.map(renderGroup)
    );
  } catch (error) {
    console.error("Failed to load publications:", error);

    const message = document.createElement("p");
    message.className = "load-error";
    message.textContent =
      "Publications could not be loaded. Run a local web server instead of opening index.html directly.";

    root.replaceChildren(message);
  }
}


function renderGroup(group) {
  const section = document.createElement("section");
  section.className = "publication-group";

  const heading = document.createElement("h3");
  heading.className = "publication-group-title";
  heading.textContent = group.heading;

  section.appendChild(heading);

  const list = document.createElement("div");
  list.className = "publication-list";

  for (const item of group.items ?? []) {
    const publication = item.text
      ? renderTextPublication(item)
      : renderMediaPublication(item);

    list.appendChild(publication);
  }

  section.appendChild(list);

  return section;
}


function renderMediaPublication(item) {
  const article = document.createElement("article");
  article.className = "publication-card";

  if (item.media) {
    article.appendChild(
      renderMedia(item.media)
    );
  }


  const body = document.createElement("div");
  body.className = "publication-body";


  // Conference / venue badge
  if (item.venue_short) {
    const badge = document.createElement("div");

    badge.className = "venue-badge";
    badge.textContent = item.venue_short;

    if (item.venue) {
      badge.title = item.venue;
    }

    body.appendChild(badge);
  }


  // Paper title
  const title = document.createElement(
    item.url ? "a" : "div"
  );

  title.className = "publication-title";
  title.textContent = item.title ?? "";

  if (item.url) {
    title.href = item.url;
    title.target = "_blank";
    title.rel = "noopener noreferrer";
  }

  body.appendChild(title);


  // Authors
  if (item.authors) {
    const authors = document.createElement("p");
    authors.className = "publication-authors";


    const authorNames = Array.isArray(item.authors)
      ? item.authors.map((author) =>
          typeof author === "string"
            ? author
            : author.name
        )
      : item.authors
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean);


    authorNames.forEach((name, index) => {
      const span = document.createElement("span");

      span.textContent = name;


      // Highlight yourself
      if (name === "Keiichi Ihara") {
        span.className = "self-author";
      }


      authors.appendChild(span);


      if (index < authorNames.length - 1) {
        authors.appendChild(
          document.createTextNode(", ")
        );
      }
    });


    body.appendChild(authors);
  }


  // Paper / Video buttons
  appendLinks(body, item);


  article.appendChild(body);

  return article;
}


function renderTextPublication(item) {
  const article = document.createElement("article");
  article.className = "text-publication";


  const text = document.createElement("p");

  text.textContent = item.text ?? "";

  article.appendChild(text);


  appendLinks(article, item);


  return article;
}


function renderMedia(media) {

  // Video
  if (media.type === "video") {
    const video = document.createElement("video");

    video.className = "publication-media";

    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    video.preload = "metadata";


    const source = document.createElement("source");

    source.src = media.src;
    source.type = media.mime ?? "video/mp4";


    video.appendChild(source);


    return video;
  }


  // Image
  const img = document.createElement("img");

  img.className = "publication-media";

  img.src = media.src;

  img.alt = media.alt ?? "";

  img.loading = "lazy";


  return img;
}


function appendLinks(parent, item) {

  const links = Array.isArray(item.links)
    ? [...item.links]
    : [];


  /*
   * If this publication has a video,
   * automatically add a Video button.
   */
  if (item.media?.type === "video") {
    const videoHref = item.video_url || item.media?.src;

    if (videoHref) {
      links.push({
        label: "Video",
        href: videoHref,
        kind: "video"
      });
    }
  }


  if (links.length === 0) {
    return;
  }


  const container = document.createElement("div");

  container.className = "publication-links";


  for (const link of links) {

    const anchor = document.createElement("a");

    anchor.className = "publication-link";

    anchor.href = link.href;

    anchor.target = "_blank";

    anchor.rel = "noopener noreferrer";


    /*
     * Bootstrap Icon
     */
    const icon = document.createElement("i");

    icon.setAttribute(
      "aria-hidden",
      "true"
    );


    if (
      link.kind === "video" ||
      link.label === "Video"
    ) {

      icon.className =
        "bi bi-play-fill";

    } else if (
      link.label === "Paper" ||
      link.label === "PDF"
    ) {

      icon.className =
        "bi bi-file-earmark-pdf";

    } else {

      icon.className =
        "bi bi-box-arrow-up-right";

    }


    anchor.appendChild(icon);


    anchor.appendChild(
      document.createTextNode(
        link.label ?? "Link"
      )
    );


    container.appendChild(anchor);
  }


  parent.appendChild(container);
}