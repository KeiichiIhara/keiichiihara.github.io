// Email link: the address is put together here so it is not plain text in the page.
document.addEventListener("DOMContentLoaded", () => {
  for (const link of document.querySelectorAll(".email-link")) {
    link.href = "mailto:" + link.dataset.user + "@" + link.dataset.domain;
  }
});

// Phone section bar: underline the section being read and keep it in view.
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.querySelector(".mobile-nav-links");
  if (!bar) return;

  const links = [...bar.querySelectorAll("a")];
  let current = null;

  function update() {
    if (getComputedStyle(bar).display === "none") return;

    let next = links[0];
    for (const link of links) {
      const section = document.querySelector(link.getAttribute("href"));
      if (section && section.getBoundingClientRect().top < 90) next = link;
    }

    // At the very bottom, the last section is the one being read.
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) {
      next = links[links.length - 1];
    }

    if (next === current) return;
    current = next;
    links.forEach((link) => link.classList.toggle("is-active", link === next));

    const r = next.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    if (r.left < b.left || r.right > b.right) {
      bar.scrollTo({ left: next.offsetLeft - bar.offsetLeft - 18, behavior: "smooth" });
    }
  }

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
});
