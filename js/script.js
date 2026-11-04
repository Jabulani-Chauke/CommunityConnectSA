
document.addEventListener("DOMContentLoaded", () => {
    // Render and filter the opportunity directory on the opportunities page.
    const opportunityList = document.getElementById("opportunityList");
    if (opportunityList) {
        const opportunities = [
            { title: "Animal Shelters", category: "animals", image: "animal-shelter.jpg", alt: "Volunteers supporting animals at a shelter", description: "Help care for animals and support animal welfare organisations." },
            { title: "Environmental Projects", category: "environment", image: "environment.jpg", alt: "Community environmental volunteering", description: "Participate in environmental clean-up and conservation projects." },
            { title: "Hospitals", category: "health", image: "hospital.jpg", alt: "Volunteers supporting a healthcare community", description: "Support healthcare workers, patients and hospital programmes." },
            { title: "Schools", category: "education", image: "school.jpg", alt: "Learners and educators at a school", description: "Assist schools, learners and educators." },
            { title: "Libraries", category: "education", image: "libraries.jpg", alt: "Library volunteering and reading support", description: "Support library activities and reading programmes." },
            { title: "Old-age Homes", category: "community", image: "elderly.jpg", alt: "Volunteers spending time with elderly people", description: "Spend time supporting and caring for elderly community members." }
        ];
        const search = document.getElementById("opportunitySearch");
        const category = document.getElementById("categoryFilter");
        const sort = document.getElementById("opportunitySort");
        const count = document.getElementById("opportunityCount");

        const render = () => {
            const term = (search?.value || "").trim().toLowerCase();
            const selectedCategory = category?.value || "all";
            let filtered = opportunities.filter(item =>
                (selectedCategory === "all" || item.category === selectedCategory) &&
                `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(term)
            );
            filtered.sort((a, b) => sort?.value === "za"
                ? b.title.localeCompare(a.title)
                : a.title.localeCompare(b.title));

            opportunityList.innerHTML = "";
            filtered.forEach(item => {
                const card = document.createElement("article");
                card.className = "card opportunity";
                const image = document.createElement("img");
                image.src = `../images/${item.image}`;
                image.alt = item.alt;
                image.loading = "lazy";
                image.className = "lightbox-image";
                const heading = document.createElement("h2");
                heading.textContent = item.title;
                const description = document.createElement("p");
                description.textContent = item.description;
                const link = document.createElement("a");
                link.href = "enquiry.html";
                link.className = "btn";
                link.textContent = "Enquire";
                card.append(image, heading, description, link);
                opportunityList.appendChild(card);
            });
            if (count) count.textContent = `${filtered.length} opportunit${filtered.length === 1 ? "y" : "ies"} found`;
            if (!filtered.length) {
                const empty = document.createElement("p");
                empty.className = "empty-results";
                empty.textContent = "No opportunities match your search. Try another keyword or category.";
                opportunityList.appendChild(empty);
            }
        };
        [search, category, sort].forEach(control => {
            control?.addEventListener(control === search ? "input" : "change", render);
        });
        render();
    }

    // Accessible image lightbox for website images.
    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Enlarged image");
    lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close enlarged image">&times;</button><img alt=""><p class="lightbox-caption"></p>';
    document.body.appendChild(lightbox);
    const lightboxImage = lightbox.querySelector("img");
    const caption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");

    document.addEventListener("click", event => {
        const image = event.target.closest("img");
        if (!image || image.closest(".image-lightbox") || image.closest("a")) return;
        if (!image.closest(".opportunity-card, .team-card, .about-image, .card, .gallery")) return;
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || "Enlarged website image";
        caption.textContent = image.alt || "";
        lightbox.classList.add("is-open");
        closeButton.focus();
    });
    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        lightboxImage.src = "";
    };
    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeLightbox();
    });

    // FAQ accordion: keep one answer open at a time.
    const faqItems = document.querySelectorAll(".faq-section details");
    faqItems.forEach(item => item.addEventListener("toggle", () => {
        if (item.open) faqItems.forEach(other => {
            if (other !== item) other.open = false;
        });
    }));

    // Front-end enquiry form feedback (no backend submission is configured).
    const enquiryForm = document.getElementById("enquiryForm");
    if (enquiryForm) {
        enquiryForm.addEventListener("submit", event => {
            event.preventDefault();
            if (!enquiryForm.reportValidity()) return;
            let feedback = document.getElementById("formFeedback");
            if (!feedback) {
                feedback = document.createElement("p");
                feedback.id = "formFeedback";
                feedback.className = "form-feedback";
                feedback.setAttribute("role", "status");
                enquiryForm.appendChild(feedback);
            }
            feedback.textContent = "Thank you. Your enquiry has been checked in this demo. A live website would send it to the organisation.";
            enquiryForm.reset();
        });
    }
});
