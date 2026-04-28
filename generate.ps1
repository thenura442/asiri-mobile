# LANDING
ng generate component landing --standalone --flat --path=src/app/landing

# CUSTOMER AUTH
ng generate component customer/auth/pages/login --standalone --flat
ng generate component customer/auth/pages/register --standalone --flat
ng generate component customer/auth/pages/otp-verify --standalone --flat
ng generate component customer/auth/pages/forgot-password --standalone --flat
ng generate component customer/auth/pages/reset-password --standalone --flat
ng generate component customer/auth/components/register-step1 --standalone --flat
ng generate component customer/auth/components/register-step2 --standalone --flat
ng generate component customer/auth/components/register-step3 --standalone --flat

# CUSTOMER HOME
ng generate component customer/home/pages/home --standalone --flat
ng generate component customer/home/components/greeting-header --standalone --flat
ng generate component customer/home/components/active-booking-card --standalone --flat
ng generate component customer/home/components/pending-charges-banner --standalone --flat
ng generate component customer/home/components/quick-actions --standalone --flat
ng generate component customer/home/components/recent-bookings-list --standalone --flat

# CUSTOMER BOOKING
ng generate component customer/booking/pages/select-tests --standalone --flat
ng generate component customer/booking/pages/prescription --standalone --flat
ng generate component customer/booking/pages/location --standalone --flat
ng generate component customer/booking/pages/schedule --standalone --flat
ng generate component customer/booking/pages/confirm --standalone --flat
ng generate component customer/booking/pages/success --standalone --flat
ng generate component customer/booking/components/test-card --standalone --flat
ng generate component customer/booking/components/test-category-filter --standalone --flat
ng generate component customer/booking/components/booking-stepper --standalone --flat
ng generate component customer/booking/components/time-slot-picker --standalone --flat
ng generate component customer/booking/components/price-breakdown --standalone --flat
ng generate component customer/booking/components/map-picker --standalone --flat
ng generate component customer/booking/components/saved-address-sheet --standalone --flat

# CUSTOMER MY BOOKINGS
ng generate component customer/my-bookings/pages/booking-list --standalone --flat
ng generate component customer/my-bookings/pages/booking-detail --standalone --flat
ng generate component customer/my-bookings/pages/live-tracking --standalone --flat
ng generate component customer/my-bookings/components/booking-card --standalone --flat
ng generate component customer/my-bookings/components/booking-status-filter --standalone --flat
ng generate component customer/my-bookings/components/tracking-map --standalone --flat
ng generate component customer/my-bookings/components/tracking-timeline --standalone --flat
ng generate component customer/my-bookings/components/cancel-booking-sheet --standalone --flat

# CUSTOMER REPORTS
ng generate component customer/reports/pages/report-list --standalone --flat
ng generate component customer/reports/pages/report-detail --standalone --flat

# CUSTOMER NOTIFICATIONS
ng generate component customer/notifications/pages/notification-list --standalone --flat

# CUSTOMER PROFILE
ng generate component customer/profile/pages/profile-view --standalone --flat
ng generate component customer/profile/pages/profile-edit --standalone --flat
ng generate component customer/profile/pages/report-issue --standalone --flat
ng generate component customer/profile/components/profile-header --standalone --flat
ng generate component customer/profile/components/profile-menu-item --standalone --flat

# CUSTOMER LAYOUT
ng generate component customer/layout/tabs --standalone --flat
ng generate component customer/layout/app-header --standalone --flat

# DRIVER AUTH
ng generate component driver/auth/pages/login --standalone --flat
ng generate component driver/auth/pages/two-factor --standalone --flat

# DRIVER MY JOB
ng generate component driver/my-job/pages/active-job --standalone --flat
ng generate component driver/my-job/pages/collection --standalone --flat
ng generate component driver/my-job/pages/job-detail --standalone --flat
ng generate component driver/my-job/components/job-status-card --standalone --flat
ng generate component driver/my-job/components/patient-info-card --standalone --flat
ng generate component driver/my-job/components/test-checklist-item --standalone --flat
ng generate component driver/my-job/components/navigate-button --standalone --flat
ng generate component driver/my-job/components/status-action-button --standalone --flat
ng generate component driver/my-job/components/empty-job-state --standalone --flat

# DRIVER HISTORY
ng generate component driver/history/pages/job-history --standalone --flat
ng generate component driver/history/components/history-card --standalone --flat

# DRIVER NOTIFICATIONS
ng generate component driver/notifications/pages/notification-list --standalone --flat

# DRIVER PROFILE
ng generate component driver/profile/pages/profile-view --standalone --flat
ng generate component driver/profile/pages/settings --standalone --flat
ng generate component driver/profile/pages/change-password --standalone --flat
ng generate component driver/profile/pages/chat --standalone --flat
ng generate component driver/profile/components/contact-branch-sheet --standalone --flat
ng generate component driver/profile/components/profile-stat-card --standalone --flat

# DRIVER EMERGENCY
ng generate component driver/emergency/pages/emergency --standalone --flat

# DRIVER LAYOUT
ng generate component driver/layout/tabs --standalone --flat
ng generate component driver/layout/app-header --standalone --flat

# SHARED COMPONENTS
ng generate component shared/components/status-badge --standalone --flat
ng generate component shared/components/empty-state --standalone --flat
ng generate component shared/components/avatar --standalone --flat
ng generate component shared/components/otp-input --standalone --flat
ng generate component shared/components/password-strength --standalone --flat
ng generate component shared/components/confirm-dialog --standalone --flat
ng generate component shared/components/skeleton-card --standalone --flat
ng generate component shared/components/notification-card --standalone --flat