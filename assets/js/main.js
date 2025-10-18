/* ============================================
   WEDDING WEBSITE - MAIN JAVASCRIPT
   ============================================ */

// ===== SNOWFALL SYSTEM =====
const SnowfallSystem = {
    container: null,
    snowflakes: [],
    normalInterval: null,
    
    init: function() {
        this.container = document.getElementById('snowfall-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'snowfall-container';
            this.container.className = 'snowfall-container';
            document.body.appendChild(this.container);
        }
        
        this.startNormalSnowfall();
        console.log('Snowfall system initialized - Normal mode only');
    },
    
    startNormalSnowfall: function() {
        // Thi thoảng có 1 snow rơi xuống (mỗi 3-5 giây)
        this.normalInterval = setInterval(() => {
            this.createSnowflake();
        }, Math.random() * 2000 + 3000); // 3-5 giây
    },
    
    createSnowflake: function() {
        const flake = document.createElement('img');
        flake.src = './assets/images/HUY_THANH_LOGO_TALES.png';
        flake.className = 'snowfall-flake';
        flake.draggable = false;
        
        // Random properties
        const size = Math.random() * 25 + 30; // 30-55px
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 4 + 6; // 6-10s
        const drift = (Math.random() - 0.5) * 100; // -50px to 50px drift
        
        console.log('Creating snowflake at position:', startX, 'top: -150px');
        
        // Apply styles
        flake.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            top: -150px;
            position: absolute;
            animation-duration: ${duration}s;
            --drift: ${drift}px;
        `;
        
        console.log('Snowflake actual position after styling:', flake.style.left, flake.style.top);
        
        // Add to container
        this.container.appendChild(flake);
        this.snowflakes.push(flake);
        
        // Remove after animation
        setTimeout(() => {
            if (flake.parentNode) {
                flake.parentNode.removeChild(flake);
            }
            const index = this.snowflakes.indexOf(flake);
            if (index > -1) {
                this.snowflakes.splice(index, 1);
            }
        }, duration * 1000 + 1000);
        
        // Limit số lượng snowflakes để tránh lag
        if (this.snowflakes.length > 10) {
            const oldFlake = this.snowflakes.shift();
            if (oldFlake && oldFlake.parentNode) {
                oldFlake.parentNode.removeChild(oldFlake);
            }
        }
    }
};

// Initialize khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // SnowfallSystem.init(); // Tạm tắt JavaScript snowfall, dùng HTML elements
    console.log('Using HTML snowfall elements instead of JavaScript generated ones');
});

(function($) {
    'use strict';

    // ===== DOCUMENT READY =====
    $(document).ready(function() {
        initializeComponents();
        setupEventHandlers();
        setupRSVPModal();
    });

    // ===== INITIALIZE COMPONENTS =====
    function initializeComponents() {
        // Initialize any carousel, sliders, etc.
        if (typeof $.fn.owlCarousel !== 'undefined') {
            $('.owl-carousel').owlCarousel({
                // Default settings
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    1200: { items: 3 }
                }
            });
        }

        // Initialize other plugins
        initializePlugins();
    }

    // ===== SETUP EVENT HANDLERS =====
    function setupEventHandlers() {
        // Smooth scrolling for anchor links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            var target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 1000);
            }
        });

        // Mobile menu toggle
        $('.mobile-menu-toggle').on('click', function() {
            $('.mobile-menu').toggleClass('active');
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.mobile-menu, .mobile-menu-toggle').length) {
                $('.mobile-menu').removeClass('active');
            }
        });
    }

    // ===== RSVP MODAL FUNCTIONALITY =====
    function setupRSVPModal() {
        // Open RSVP Modal
        $('.rsvp-button, .rsvp-trigger').on('click', function(e) {
            e.preventDefault();
            openRSVPModal();
        });

        // Close RSVP Modal
        $('.rsvp-modal .close, .rsvp-modal-overlay').on('click', function(e) {
            if (e.target === this) {
                closeRSVPModal();
            }
        });

        // RSVP Form Submission
        $('#rsvpForm').on('submit', function(e) {
            e.preventDefault();
            submitRSVPForm();
        });

        // Form validation on input change
        $('#guestName, #guestPhone').on('input', function() {
            validateRSVPForm();
        });

        // Guest count change handler
        $('#guestCount').on('change', function() {
            validateRSVPForm();
        });
    }

    // ===== RSVP MODAL FUNCTIONS =====
    function openRSVPModal() {
        $('#rsvpModal').fadeIn(300);
        $('body').addClass('modal-open');
        resetRSVPForm();
    }

    function closeRSVPModal() {
        $('#rsvpModal').fadeOut(300);
        $('body').removeClass('modal-open');
    }

    function resetRSVPForm() {
        $('#rsvpForm')[0].reset();
        $('.error-message').remove();
        $('.form-group').removeClass('error');
        $('#submitBtn').prop('disabled', true);
    }

    function validateRSVPForm() {
        var isValid = true;
        var name = $('#guestName').val().trim();
        var phone = $('#guestPhone').val().trim();
        var count = $('#guestCount').val();

        // Clear previous errors
        $('.error-message').remove();
        $('.form-group').removeClass('error');

        // Validate name
        if (name.length < 2) {
            showFieldError('#guestName', 'Vui lòng nhập tên đầy đủ (ít nhất 2 ký tự)');
            isValid = false;
        }

        // Validate phone
        var phonePattern = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        if (!phonePattern.test(phone.replace(/\s/g, ''))) {
            showFieldError('#guestPhone', 'Vui lòng nhập số điện thoại hợp lệ');
            isValid = false;
        }

        // Validate guest count
        if (!count || count < 1) {
            showFieldError('#guestCount', 'Vui lòng chọn số lượng khách');
            isValid = false;
        }

        // Enable/disable submit button
        $('#submitBtn').prop('disabled', !isValid);
        
        return isValid;
    }

    function showFieldError(fieldSelector, message) {
        var $field = $(fieldSelector);
        var $formGroup = $field.closest('.form-group');
        
        $formGroup.addClass('error');
        $formGroup.append('<div class="error-message">' + message + '</div>');
    }

    function submitRSVPForm() {
        if (!validateRSVPForm()) {
            return;
        }

        var formData = {
            name: $('#guestName').val().trim(),
            phone: $('#guestPhone').val().trim(),
            count: $('#guestCount').val(),
            message: $('#guestMessage').val().trim()
        };

        // Disable submit button and show loading
        $('#submitBtn').prop('disabled', true).text('Đang gửi...');

        // Simulate form submission (replace with actual endpoint)
        setTimeout(function() {
            // Show success message
            Swal.fire({
                title: 'Cảm ơn bạn!',
                text: 'Chúng tôi đã nhận được xác nhận tham dự của bạn.',
                icon: 'success',
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#e74c3c'
            }).then(function() {
                closeRSVPModal();
            });

            // Reset form
            resetRSVPForm();
            $('#submitBtn').text('Xác nhận tham dự');
        }, 1500);
    }

    // ===== PLUGIN INITIALIZATION =====
    function initializePlugins() {
        // Initialize date picker if available
        if (typeof flatpickr !== 'undefined') {
            flatpickr('.datepicker', {
                dateFormat: 'd/m/Y',
                locale: 'vn'
            });
        }

        // Initialize other plugins as needed
        if (typeof $.fn.minicolors !== 'undefined') {
            $('.color-picker').minicolors({
                theme: 'bootstrap'
            });
        }
    }

    // ===== UTILITY FUNCTIONS =====
    function formatPhoneNumber(phone) {
        // Remove all non-digits
        var cleaned = phone.replace(/\D/g, '');
        
        // Format Vietnamese phone number
        if (cleaned.length === 10 && cleaned.startsWith('0')) {
            return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
        }
        
        return phone;
    }

    // ===== SCROLL EFFECTS =====
    $(window).on('scroll', function() {
        var scrollTop = $(this).scrollTop();
        
        // Add header background on scroll
        if (scrollTop > 100) {
            $('.main-header').addClass('scrolled');
        } else {
            $('.main-header').removeClass('scrolled');
        }

        // Parallax effects
        $('.parallax-element').each(function() {
            var speed = $(this).data('speed') || 0.5;
            var yPos = -(scrollTop * speed);
            $(this).css('transform', 'translateY(' + yPos + 'px)');
        });
    });

    // ===== RESIZE HANDLER =====
    $(window).on('resize', function() {
        // Handle responsive adjustments
        adjustResponsiveElements();
    });

    function adjustResponsiveElements() {
        // Adjust elements based on window size
        var windowWidth = $(window).width();
        
        if (windowWidth < 768) {
            // Mobile adjustments
            $('.desktop-only').hide();
            $('.mobile-only').show();
        } else {
            // Desktop adjustments
            $('.desktop-only').show();
            $('.mobile-only').hide();
        }
    }

    // ===== LOADING EFFECTS =====
    $(window).on('load', function() {
        // Hide loading screen
        $('.loading-screen').fadeOut(500);
        
        // Initialize animations
        initializeAnimations();
    });

    function initializeAnimations() {
        // Add animation classes to elements
        $('.animate-on-scroll').each(function() {
            var $element = $(this);
            var animationType = $element.data('animation') || 'fadeInUp';
            
            $(window).on('scroll', function() {
                var elementTop = $element.offset().top;
                var elementBottom = elementTop + $element.outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();
                
                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $element.addClass('animated ' + animationType);
                }
            });
        });
    }

})(jQuery);