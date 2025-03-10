$(document).ready(function () {
    // Destination autocomplete
    $("#destination").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "https://nominatim.openstreetmap.org/search",
                dataType: "json",
                data: { format: "json", q: request.term },
                success: function (data) {
                    response(data.map(item => ({
                        label: item.display_name,
                        value: item.display_name
                    })));
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            $("#destination").val(ui.item.value);
            return false;
        }
    });

    // Check-in & Check-out datepicker
    $("#checkin, #checkout").datepicker({
        dateFormat: "dd/mm/yy",
        minDate: 0,
        onSelect: function (dateText) {
            $(this).val(dateText);
        }
    });

    // Guest selection
    let guests = { adult: 1, child: 0, infant: 0 };

    $("#guests").click(function () {
        $("#guest-dropdown").toggle();
        $(this).toggleClass("active");
    });

    $("select").change(function () {
        guests.adult = parseInt($("#adult-count").val());
        guests.child = parseInt($("#child-count").val());
        guests.infant = parseInt($("#infant-count").val());
        updateGuestInput();
    });

    function updateGuestInput() {
        let text = "Add guests";
        if (guests.adult > 0 || guests.child > 0 || guests.infant > 0) {
            text = `${guests.adult} Adult`;
            if (guests.child > 0) text += `, ${guests.child} Child`;
            if (guests.infant > 0) text += `, ${guests.infant} Infant`;
        }
        $("#guests").html(text + ' <img src="assets/images/arrow-down.svg" alt="dropdown icon">');
    }

    $("#close-guest-dropdown").click(function (event) {
        event.stopPropagation();
        $("#guest-dropdown").hide();
        $("#guests").removeClass("active");
    });

    $(document).click(function (event) {
        if (!$(event.target).closest("#guests-container, #guest-dropdown").length) {
            $("#guest-dropdown").hide();
            $("#guests").removeClass("active");
        }
    });

    $('#contact-form').parsley(); 

    // Open Sidebar
    $("#burgerMenu").click(function () {
        $("#sidebar").addClass("active");
        $("#overlay").addClass("active");
    });

    // Close Sidebar
    $("#closeSidebar, #overlay").click(function () {
        $("#sidebar").removeClass("active");
        $("#overlay").removeClass("active");
    });

    // Hero slider initialization
    setTimeout(() => {
        if ($(".hero-slider").length) {
            new Glide(".hero-slider", {
                type: "carousel",
                autoplay: 3000,
                hoverpause: true,
                animationDuration: 1000,
                perView: 1,
                gap: 0
            }).mount();
        }
    }, 500);

    // News slider
    const newsSlider = document.querySelector(".glide__slides-news");
    const slides = document.querySelectorAll(".glide__slide-news");
    const prevBtn = document.querySelector(".glide__arrow--left");
    const nextBtn = document.querySelector(".glide__arrow--right");

    if (newsSlider && slides.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;

        function updateSlide() {
            let offset = -currentIndex * 100;
            newsSlider.style.transition = "transform 0.3s ease-in-out"; 
            newsSlider.style.transform = `translateX(${offset}%)`;
        }

        nextBtn.addEventListener("click", function () {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateSlide();
            }
        });

        prevBtn.addEventListener("click", function () {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlide();
            }
        });
    } else {
        console.warn("News slider or arrows not found.");
    }
});
