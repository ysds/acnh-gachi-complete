<template>
  <div class="wrapper">
    <template v-if="showSaleFilter">
      <popper trigger="clickToToggle" :visible-arrow="false" ref="saleFilter">
        <div slot="reference" style="position: relative;">
          <div class="btn-label">取得方法</div>
          <button
            type="button"
            class="dropdown-btn"
            :class="{ active: openSaleFilter() }"
          >
            <span class="tg" v-if="filter.saleFilter === '0'">すべて</span>
            <span class="tg" v-else-if="filter.saleFilter === '1'"
              >お店＆<svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                style="margin-top: -3px;"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2539 11.8225C11.2484 11.8336 11.2408 11.8434 11.2316 11.8514C11.2224 11.8594 11.2118 11.8654 11.2004 11.8691C11.1226 11.9017 11.0376 11.9013 10.9591 11.9309C10.9383 11.9387 10.9104 11.9247 10.8889 11.9309C10.7931 11.9609 10.6919 11.9421 10.5957 11.9714C10.5555 11.9769 10.5148 11.9782 10.4743 11.9754C9.99558 12.0148 9.51609 11.9962 9.03714 11.9914C8.91959 11.9926 8.80209 11.9859 8.68537 11.9712C8.61685 11.9701 8.54851 11.9632 8.48104 11.9506C8.39832 11.9227 8.31367 11.9433 8.23171 11.9169C8.1837 11.9015 8.12938 11.9034 8.07827 11.8916C7.99416 11.872 7.90908 11.8579 7.82594 11.8329C7.757 11.8124 7.68689 11.7965 7.61603 11.7854C7.54489 11.7735 7.47781 11.7463 7.40709 11.7323C7.31066 11.7134 7.22044 11.6717 7.12326 11.6526C7.04576 11.6324 6.9693 11.608 6.89417 11.5796C6.79013 11.5473 6.68566 11.5165 6.58141 11.485C6.53297 11.4711 6.48527 11.4545 6.43847 11.4354C6.29615 11.3865 6.15786 11.3255 6.02499 11.2531C6.00163 11.2381 5.99648 11.2233 6.00206 11.2029C6.02349 11.1223 6.04492 11.0412 6.07245 10.9625C6.10856 10.859 6.14864 10.7569 6.19032 10.6556C6.22996 10.5585 6.27871 10.4648 6.31375 10.3662C6.34446 10.2928 6.36954 10.217 6.38875 10.1395C6.39659 10.1039 6.40808 10.0694 6.42304 10.0364C6.44567 9.98054 6.46189 9.92206 6.47137 9.86219C6.48228 9.80915 6.49685 9.757 6.51498 9.70617C6.54776 9.60514 6.56234 9.49884 6.5918 9.39714C6.61495 9.31722 6.6308 9.23471 6.64677 9.15434C6.6672 9.07373 6.68354 8.99205 6.69574 8.90963C6.7052 8.83514 6.71995 8.76148 6.73988 8.68928C6.7563 8.63057 6.76785 8.57048 6.77438 8.50968C6.78005 8.47049 6.7884 8.43178 6.79935 8.39384C6.8084 8.30678 6.82519 8.2208 6.84949 8.13701C6.86366 8.09417 6.87178 8.0494 6.8736 8.0041C6.8819 7.92405 6.8967 7.84489 6.91785 7.76748C6.9515 7.63862 6.98214 7.5084 7.01279 7.3792C7.04932 7.2243 7.10193 7.07545 7.14479 6.92324C7.16054 6.86711 7.19247 6.81256 7.21101 6.75565C7.24541 6.65047 7.30434 6.55831 7.3458 6.45706C7.36665 6.41313 7.39133 6.37131 7.41952 6.33213C7.51993 6.18862 7.63215 6.0546 7.7549 5.93162C7.86444 5.82433 7.98082 5.72499 8.10323 5.63426C8.1742 5.58504 8.24755 5.53971 8.323 5.49844C8.3902 5.4536 8.46076 5.41452 8.53397 5.38159C8.64055 5.32455 8.75169 5.27741 8.86613 5.24071C8.9373 5.2224 9.0071 5.19865 9.07496 5.16966C9.11141 5.15716 9.1486 5.14718 9.18629 5.1398C9.26809 5.1193 9.35085 5.10326 9.43423 5.09175C9.58169 5.06789 9.73056 5.0548 9.87975 5.05258C9.98721 5.05571 10.0942 5.06894 10.1994 5.09209C10.3231 5.11359 10.4455 5.14336 10.5656 5.18122C10.6976 5.22428 10.8274 5.27456 10.9543 5.33186C11.0714 5.39064 11.1856 5.45572 11.2963 5.52684C11.3404 5.54828 11.3796 5.57945 11.4112 5.61821C11.4298 5.64073 11.4525 5.65906 11.4781 5.67209C11.5174 5.696 11.5371 5.74259 11.5667 5.77693C11.6443 5.86727 11.7362 5.94291 11.8383 6.00054C11.851 6.0096 11.8666 6.01307 11.8817 6.01019C11.8968 6.00731 11.9103 5.99832 11.9191 5.98516C11.9637 5.92818 11.9994 5.86415 12.0249 5.79546C12.0784 5.66345 12.1353 5.53245 12.178 5.39595C12.2016 5.32075 12.2316 5.24857 12.2524 5.17145C12.2832 5.0546 12.3269 4.93999 12.361 4.82347C12.3903 4.72312 12.4102 4.61974 12.436 4.51815C12.4634 4.41534 12.4788 4.30943 12.482 4.20273C12.4838 4.16243 12.4939 4.12301 12.5114 4.08711C12.5173 4.06902 12.527 4.05254 12.5397 4.03885C12.5525 4.02517 12.568 4.01463 12.5851 4.008C12.6022 4.00137 12.6205 3.99881 12.6387 4.00051C12.6568 4.00222 12.6744 4.00814 12.6901 4.01785C12.7803 4.05607 12.8673 4.10186 12.9504 4.1548C13.016 4.19644 13.0771 4.24606 13.1387 4.29421C13.2021 4.34395 13.2622 4.39826 13.3185 4.45675C13.3516 4.4911 13.3591 4.53331 13.3244 4.56238C13.2443 4.62973 13.1718 4.70482 13.0909 4.77072C13.0493 4.81124 13.011 4.85544 12.9767 4.90284C12.9053 4.985 12.8487 5.07896 12.7838 5.16584C12.7004 5.28353 12.6246 5.40686 12.5567 5.53503C12.4957 5.64064 12.4465 5.75331 12.4103 5.87078C12.3715 5.9799 12.355 6.09636 12.362 6.21258C12.362 6.24846 12.3725 6.28347 12.3921 6.31292C12.4117 6.34237 12.4394 6.36485 12.4715 6.37736C12.5847 6.43344 12.6928 6.50044 12.7942 6.57751C12.8451 6.61118 12.8969 6.64317 12.9468 6.67853C12.982 6.70345 13.0153 6.73174 13.0482 6.76025C13.067 6.78052 13.0897 6.7964 13.1148 6.80684C13.1528 6.81806 13.1633 6.86375 13.1931 6.88339C13.2411 6.92151 13.2863 6.96327 13.3284 7.00833C13.3995 7.07558 13.4642 7.15002 13.5213 7.23058C13.5619 7.28401 13.5856 7.35283 13.6259 7.40918C13.7668 7.65012 13.8716 7.91228 13.9366 8.18651C13.9524 8.26868 13.9592 8.35287 13.977 8.43346C14.0021 8.59394 14.0067 8.75721 13.9906 8.91895C13.9895 8.9991 13.9793 9.07884 13.9603 9.15647C13.9406 9.22966 13.9336 9.30723 13.9156 9.3821C13.8912 9.48739 13.8615 9.59126 13.8266 9.69326C13.7764 9.83548 13.7167 9.97321 13.6563 10.1111C13.6039 10.2154 13.546 10.3166 13.4827 10.4141C13.4406 10.4873 13.3875 10.5514 13.3409 10.6208C13.3242 10.6432 13.3059 10.6641 13.2859 10.6832C13.2177 10.7557 13.1498 10.8283 13.0806 10.8997C13.0319 10.9396 12.9772 10.9708 12.9189 10.9922C12.8916 11.0063 12.8622 10.9783 12.8637 10.9418C12.8584 10.8764 12.8641 10.8104 12.8805 10.7471C12.8875 10.7142 12.8891 10.6803 12.8852 10.6468C12.8859 10.5725 12.9107 10.5009 12.9066 10.4256C12.8974 10.1851 12.8311 9.95087 12.7137 9.74399C12.6883 9.69936 12.6572 9.6585 12.6214 9.62254C12.5966 9.59818 12.5762 9.55261 12.5481 9.52084C12.4889 9.46508 12.4265 9.41313 12.3613 9.36526C12.2986 9.31341 12.229 9.27126 12.1548 9.2401C12.0959 9.21612 12.0358 9.19577 11.9746 9.17915C11.8753 9.14803 11.7721 9.13307 11.6685 9.13481C11.5541 9.1321 11.4398 9.1412 11.3271 9.16197C11.3111 9.16747 11.2956 9.17442 11.2808 9.18274C11.1923 9.21922 11.1007 9.2493 11.0161 9.29387C10.9627 9.31857 10.9154 9.35579 10.8779 9.40264C10.8605 9.42094 10.8404 9.43628 10.8184 9.4481C10.7106 9.5338 10.6118 9.63118 10.5236 9.73861C10.4083 9.86351 10.3173 10.0108 10.2557 10.1721C10.2249 10.2483 10.2087 10.3301 10.2079 10.4129C10.1992 10.5701 10.2064 10.7278 10.2294 10.8833C10.2582 10.9971 10.3008 11.1065 10.3561 11.2089C10.3962 11.2888 10.452 11.3588 10.52 11.4143C10.6008 11.4901 10.6909 11.5542 10.7878 11.6051C10.8566 11.6356 10.9233 11.6789 10.9932 11.7084C11.0593 11.7499 11.1319 11.7791 11.2075 11.7945C11.222 11.7961 11.2375 11.8128 11.2539 11.8225Z"
                  fill="#444"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 2H6C4.89543 2 4 2.89543 4 4V14.4998C4.41783 14.186 4.9372 14 5.5 14H16V2ZM5.5 18C4.67157 18 4 17.3284 4 16.5C4 15.6716 4.67157 15 5.5 15H16V16H6V17H16V18H5.5ZM17 2V14V18C17 18.5523 16.5523 19 16 19H5.5C4.11929 19 3 17.8807 3 16.5V4C3 2.34315 4.34315 1 6 1H16C16.5523 1 17 1.44772 17 2Z"
                  fill="#444"
                />
              </svg>
            </span>
            <span class="tg" v-else-if="filter.saleFilter === '2'">DIY</span>
            <span class="tg" v-else-if="filter.saleFilter === '3'">その他</span>
            <img src="../assets/arrow.svg" width="12" alt="" />
          </button>
        </div>
        <div class="dropdown-menu">
          <DropdownItem @click="onClickSaleFilter('0')">
            <span class="tg">すべて</span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('1')">
            <span class="tg"
              >お店＆<svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                style="margin-top: -3px;"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2539 11.8225C11.2484 11.8336 11.2408 11.8434 11.2316 11.8514C11.2224 11.8594 11.2118 11.8654 11.2004 11.8691C11.1226 11.9017 11.0376 11.9013 10.9591 11.9309C10.9383 11.9387 10.9104 11.9247 10.8889 11.9309C10.7931 11.9609 10.6919 11.9421 10.5957 11.9714C10.5555 11.9769 10.5148 11.9782 10.4743 11.9754C9.99558 12.0148 9.51609 11.9962 9.03714 11.9914C8.91959 11.9926 8.80209 11.9859 8.68537 11.9712C8.61685 11.9701 8.54851 11.9632 8.48104 11.9506C8.39832 11.9227 8.31367 11.9433 8.23171 11.9169C8.1837 11.9015 8.12938 11.9034 8.07827 11.8916C7.99416 11.872 7.90908 11.8579 7.82594 11.8329C7.757 11.8124 7.68689 11.7965 7.61603 11.7854C7.54489 11.7735 7.47781 11.7463 7.40709 11.7323C7.31066 11.7134 7.22044 11.6717 7.12326 11.6526C7.04576 11.6324 6.9693 11.608 6.89417 11.5796C6.79013 11.5473 6.68566 11.5165 6.58141 11.485C6.53297 11.4711 6.48527 11.4545 6.43847 11.4354C6.29615 11.3865 6.15786 11.3255 6.02499 11.2531C6.00163 11.2381 5.99648 11.2233 6.00206 11.2029C6.02349 11.1223 6.04492 11.0412 6.07245 10.9625C6.10856 10.859 6.14864 10.7569 6.19032 10.6556C6.22996 10.5585 6.27871 10.4648 6.31375 10.3662C6.34446 10.2928 6.36954 10.217 6.38875 10.1395C6.39659 10.1039 6.40808 10.0694 6.42304 10.0364C6.44567 9.98054 6.46189 9.92206 6.47137 9.86219C6.48228 9.80915 6.49685 9.757 6.51498 9.70617C6.54776 9.60514 6.56234 9.49884 6.5918 9.39714C6.61495 9.31722 6.6308 9.23471 6.64677 9.15434C6.6672 9.07373 6.68354 8.99205 6.69574 8.90963C6.7052 8.83514 6.71995 8.76148 6.73988 8.68928C6.7563 8.63057 6.76785 8.57048 6.77438 8.50968C6.78005 8.47049 6.7884 8.43178 6.79935 8.39384C6.8084 8.30678 6.82519 8.2208 6.84949 8.13701C6.86366 8.09417 6.87178 8.0494 6.8736 8.0041C6.8819 7.92405 6.8967 7.84489 6.91785 7.76748C6.9515 7.63862 6.98214 7.5084 7.01279 7.3792C7.04932 7.2243 7.10193 7.07545 7.14479 6.92324C7.16054 6.86711 7.19247 6.81256 7.21101 6.75565C7.24541 6.65047 7.30434 6.55831 7.3458 6.45706C7.36665 6.41313 7.39133 6.37131 7.41952 6.33213C7.51993 6.18862 7.63215 6.0546 7.7549 5.93162C7.86444 5.82433 7.98082 5.72499 8.10323 5.63426C8.1742 5.58504 8.24755 5.53971 8.323 5.49844C8.3902 5.4536 8.46076 5.41452 8.53397 5.38159C8.64055 5.32455 8.75169 5.27741 8.86613 5.24071C8.9373 5.2224 9.0071 5.19865 9.07496 5.16966C9.11141 5.15716 9.1486 5.14718 9.18629 5.1398C9.26809 5.1193 9.35085 5.10326 9.43423 5.09175C9.58169 5.06789 9.73056 5.0548 9.87975 5.05258C9.98721 5.05571 10.0942 5.06894 10.1994 5.09209C10.3231 5.11359 10.4455 5.14336 10.5656 5.18122C10.6976 5.22428 10.8274 5.27456 10.9543 5.33186C11.0714 5.39064 11.1856 5.45572 11.2963 5.52684C11.3404 5.54828 11.3796 5.57945 11.4112 5.61821C11.4298 5.64073 11.4525 5.65906 11.4781 5.67209C11.5174 5.696 11.5371 5.74259 11.5667 5.77693C11.6443 5.86727 11.7362 5.94291 11.8383 6.00054C11.851 6.0096 11.8666 6.01307 11.8817 6.01019C11.8968 6.00731 11.9103 5.99832 11.9191 5.98516C11.9637 5.92818 11.9994 5.86415 12.0249 5.79546C12.0784 5.66345 12.1353 5.53245 12.178 5.39595C12.2016 5.32075 12.2316 5.24857 12.2524 5.17145C12.2832 5.0546 12.3269 4.93999 12.361 4.82347C12.3903 4.72312 12.4102 4.61974 12.436 4.51815C12.4634 4.41534 12.4788 4.30943 12.482 4.20273C12.4838 4.16243 12.4939 4.12301 12.5114 4.08711C12.5173 4.06902 12.527 4.05254 12.5397 4.03885C12.5525 4.02517 12.568 4.01463 12.5851 4.008C12.6022 4.00137 12.6205 3.99881 12.6387 4.00051C12.6568 4.00222 12.6744 4.00814 12.6901 4.01785C12.7803 4.05607 12.8673 4.10186 12.9504 4.1548C13.016 4.19644 13.0771 4.24606 13.1387 4.29421C13.2021 4.34395 13.2622 4.39826 13.3185 4.45675C13.3516 4.4911 13.3591 4.53331 13.3244 4.56238C13.2443 4.62973 13.1718 4.70482 13.0909 4.77072C13.0493 4.81124 13.011 4.85544 12.9767 4.90284C12.9053 4.985 12.8487 5.07896 12.7838 5.16584C12.7004 5.28353 12.6246 5.40686 12.5567 5.53503C12.4957 5.64064 12.4465 5.75331 12.4103 5.87078C12.3715 5.9799 12.355 6.09636 12.362 6.21258C12.362 6.24846 12.3725 6.28347 12.3921 6.31292C12.4117 6.34237 12.4394 6.36485 12.4715 6.37736C12.5847 6.43344 12.6928 6.50044 12.7942 6.57751C12.8451 6.61118 12.8969 6.64317 12.9468 6.67853C12.982 6.70345 13.0153 6.73174 13.0482 6.76025C13.067 6.78052 13.0897 6.7964 13.1148 6.80684C13.1528 6.81806 13.1633 6.86375 13.1931 6.88339C13.2411 6.92151 13.2863 6.96327 13.3284 7.00833C13.3995 7.07558 13.4642 7.15002 13.5213 7.23058C13.5619 7.28401 13.5856 7.35283 13.6259 7.40918C13.7668 7.65012 13.8716 7.91228 13.9366 8.18651C13.9524 8.26868 13.9592 8.35287 13.977 8.43346C14.0021 8.59394 14.0067 8.75721 13.9906 8.91895C13.9895 8.9991 13.9793 9.07884 13.9603 9.15647C13.9406 9.22966 13.9336 9.30723 13.9156 9.3821C13.8912 9.48739 13.8615 9.59126 13.8266 9.69326C13.7764 9.83548 13.7167 9.97321 13.6563 10.1111C13.6039 10.2154 13.546 10.3166 13.4827 10.4141C13.4406 10.4873 13.3875 10.5514 13.3409 10.6208C13.3242 10.6432 13.3059 10.6641 13.2859 10.6832C13.2177 10.7557 13.1498 10.8283 13.0806 10.8997C13.0319 10.9396 12.9772 10.9708 12.9189 10.9922C12.8916 11.0063 12.8622 10.9783 12.8637 10.9418C12.8584 10.8764 12.8641 10.8104 12.8805 10.7471C12.8875 10.7142 12.8891 10.6803 12.8852 10.6468C12.8859 10.5725 12.9107 10.5009 12.9066 10.4256C12.8974 10.1851 12.8311 9.95087 12.7137 9.74399C12.6883 9.69936 12.6572 9.6585 12.6214 9.62254C12.5966 9.59818 12.5762 9.55261 12.5481 9.52084C12.4889 9.46508 12.4265 9.41313 12.3613 9.36526C12.2986 9.31341 12.229 9.27126 12.1548 9.2401C12.0959 9.21612 12.0358 9.19577 11.9746 9.17915C11.8753 9.14803 11.7721 9.13307 11.6685 9.13481C11.5541 9.1321 11.4398 9.1412 11.3271 9.16197C11.3111 9.16747 11.2956 9.17442 11.2808 9.18274C11.1923 9.21922 11.1007 9.2493 11.0161 9.29387C10.9627 9.31857 10.9154 9.35579 10.8779 9.40264C10.8605 9.42094 10.8404 9.43628 10.8184 9.4481C10.7106 9.5338 10.6118 9.63118 10.5236 9.73861C10.4083 9.86351 10.3173 10.0108 10.2557 10.1721C10.2249 10.2483 10.2087 10.3301 10.2079 10.4129C10.1992 10.5701 10.2064 10.7278 10.2294 10.8833C10.2582 10.9971 10.3008 11.1065 10.3561 11.2089C10.3962 11.2888 10.452 11.3588 10.52 11.4143C10.6008 11.4901 10.6909 11.5542 10.7878 11.6051C10.8566 11.6356 10.9233 11.6789 10.9932 11.7084C11.0593 11.7499 11.1319 11.7791 11.2075 11.7945C11.222 11.7961 11.2375 11.8128 11.2539 11.8225Z"
                  fill="#444"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 2H6C4.89543 2 4 2.89543 4 4V14.4998C4.41783 14.186 4.9372 14 5.5 14H16V2ZM5.5 18C4.67157 18 4 17.3284 4 16.5C4 15.6716 4.67157 15 5.5 15H16V16H6V17H16V18H5.5ZM17 2V14V18C17 18.5523 16.5523 19 16 19H5.5C4.11929 19 3 17.8807 3 16.5V4C3 2.34315 4.34315 1 6 1H16C16.5523 1 17 1.44772 17 2Z"
                  fill="#444"
                /></svg
            ></span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('2')">
            <span class="tg">DIY</span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('3')">
            <span class="tg">その他</span>
          </DropdownItem>
        </div>
      </popper>
      <div class="divider" />
    </template>
    <popper
      trigger="clickToToggle"
      :visible-arrow="false"
      ref="collectedFilter"
    >
      <div slot="reference" style="position: relative;">
        <div class="btn-label">チェック状態</div>
        <button
          type="button"
          class="dropdown-btn"
          :class="{ active: openCollectedFilter() }"
        >
          <span class="tg" v-if="filter.collectedFilter === '0'">すべて</span>
          <span class="tg tg-gr" v-else-if="filter.collectedFilter === '1'"
            >取得済</span
          >
          <span class="tg tg-bl" v-else-if="filter.collectedFilter === '2'"
            >配布可</span
          >
          <template v-else-if="filter.collectedFilter === '3'">
            <span class="tg tg-gr">取</span>＋<span class="tg tg-bl">配</span>
          </template>
          <span class="tg" v-else>未取得</span>
          <img src="../assets/arrow.svg" width="12" alt="" />
        </button>
      </div>
      <div class="dropdown-menu">
        <DropdownItem @click="onClickCollectedFilter('0')">
          <span class="tg">すべて</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('1')">
          <span class="tg tg-gr">取得済</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('2')">
          <span class="tg tg-bl">配布可</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('3')">
          <span class="tg tg-gr">取</span>＋<span class="tg tg-bl">配</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('4')">
          <span class="tg">未取得</span>
        </DropdownItem>
      </div>
    </popper>
    <template v-if="showBatchAction">
      <div class="divider" />
      <popper
        trigger="clickToToggle"
        :visible-arrow="false"
        ref="batchOpePopper"
      >
        <div slot="reference" style="position: relative;">
          <div class="btn-label">一括操作</div>
          <button
            type="button"
            class="dropdown-btn"
            :class="{ active: openBatchOpe() }"
          >
            <span class="tg">操作...</span>
            <img src="../assets/arrow.svg" width="12" alt="" />
          </button>
        </div>
        <div class="dropdown-menu">
          <DropdownItem @click="onClickBatchOperation('allCollected')">
            <span class="tg"
              >すべて<span class="tg tg-gr">取得済</span>としてチェック</span
            >
          </DropdownItem>
          <DropdownItem @click="onClickBatchOperation('allProvidable')">
            <span class="tg"
              >すべて<span class="tg tg-bl">配布可</span>としてチェック</span
            >
          </DropdownItem>
          <DropdownItem @click="onClickBatchOperation('allUncheck')">
            <span class="tg">すべてのチェックを外す</span>
          </DropdownItem>
        </div>
      </popper>
    </template>
    <template v-if="showPinOption">
      <div class="divider" />
      <Button :active="isPinned" @click="onClickPin">
        <IconPinned v-if="isPinned" />
        <IconPin v-else />
      </Button>
    </template>
    <template v-if="showShareButton">
      <div class="divider" />
      <Button @click="showShareModal">
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          style="margin-top: -3px;"
          class="bi bi-share"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
          />
        </svg>
      </Button>
      <Modal :show="isShowModal" @close="isShowModal = false">
        <template slot="header">あなたの「{{ navText }}」のURL</template>
        <div slot="body">
          <p>URL をクリップボードにコピーしました！</p>
          <p>
            公開ページ（{{ navText }}）<br />
            <router-link :to="`/share/${user.uid}/${currentNav}`">
              {{ shareURL }}
            </router-link>
          </p>
          <div>
            <a
              class="btn"
              :href="
                `https://twitter.com/intent/tweet?text=%0a${navText}%0a&url=${twitterURL}`
              "
              >Twitter に投稿</a
            >
          </div>
        </div>
      </Modal>
    </template>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import { getNavText } from "../utils/nav.js";
import DropdownItem from "./DropdownItem";
import Button from "./Button";
import IconPin from "./IconPin";
import IconPinned from "./IconPinned";
import Modal from "./Modal";

export default {
  name: "FilterUI",
  components: {
    Popper,
    DropdownItem,
    Button,
    IconPin,
    IconPinned,
    Modal
  },
  props: {
    filter: Object,
    showSaleFilter: {
      type: Boolean,
      default: false
    },
    showPinOption: {
      type: Boolean,
      default: false
    },
    showBatchAction: {
      type: Boolean,
      default: true
    },
    showShareButton: {
      type: Boolean,
      default: false
    },
    currentNav: String,
    pins: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isPinned: false,
      isShowModal: false,
      shareURL: "",
      twitterURL: ""
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    navText() {
      return getNavText(this.currentNav);
    }
  },
  mounted() {
    this.isPinned = this.pins[this.currentNav];
  },
  watch: {
    currentNav: function() {
      this.isPinned = this.pins[this.currentNav];
    }
  },
  methods: {
    onClickSaleFilter: function(value) {
      this.$refs.saleFilter.doClose();
      this.$emit("change", Object.assign(this.filter, { saleFilter: value }));
    },
    onClickCollectedFilter: function(value) {
      this.$refs.collectedFilter.doClose();
      this.$emit(
        "change",
        Object.assign(this.filter, { collectedFilter: value })
      );
    },
    onClickBatchOperation: function(value) {
      this.$refs.batchOpePopper.doClose();
      if (value) this.$emit("clickBatchAction", value);
    },
    onClickPin: function() {
      this.isPinned = !this.isPinned;
      this.$emit("changePin", this.currentNav, this.isPinned);
    },
    openSaleFilter: function() {
      if (!this.$refs.saleFilter) return false;
      return this.$refs.saleFilter.showPopper;
    },
    openCollectedFilter: function() {
      if (!this.$refs.collectedFilter) return false;
      return this.$refs.collectedFilter.showPopper;
    },
    openBatchOpe: function() {
      if (!this.$refs.batchOpePopper) return false;
      return this.$refs.batchOpePopper.showPopper;
    },
    showShareModal: function() {
      const shareURL = `https://ysds.github.io/acnh-gachi-complete/#/share/${this.user.uid}/${this.currentNav}`;
      this.shareURL = shareURL;
      this.twitterURL = `https://ysds.github.io/acnh-gachi-complete/%23/share/${this.user.uid}/${this.currentNav}`;
      this.$copyText(shareURL);
      this.isShowModal = true;
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.divider {
  margin-right: 0.3rem;
  margin-left: 0.15rem;
}

.btn-label {
  position: absolute;
  top: 0;
  left: 5px;
  z-index: 2;
  padding: 0 2px;
  font-size: 10px;
  background-color: white;
  border-radius: 8px;
  pointer-events: none;
  white-space: nowrap;
}

.dropdown-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  min-width: 60px;
  padding: 0.5rem 0.3rem 0.2rem 0.4rem;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: 0;

  @media (min-width: 360px) {
    padding: 0.6rem 0.6rem 0.3rem;
  }

  &.active {
    border-color: #42b983;

    img {
      transform: rotate(180deg);
    }
  }

  img {
    margin-top: -3px;
    margin-left: 2px;

    @media (min-width: 360px) {
      margin-left: 4px;
    }
  }
}

.dropdown-menu {
  position: absolute;
  margin-top: 3px;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-size: 14px;

  .tg {
    padding-right: 0.2rem;
    padding-left: 0.2rem;
  }
}

.tg {
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  border-radius: 3px;
  line-height: 1.3;
}

.tg-gr {
  padding-right: 0.2rem;
  padding-left: 0.2rem;
  background-color: #b6ecd4;
}

.tg-bl {
  padding-right: 0.3rem;
  padding-left: 0.3rem;
  background-color: #a0cbff;
}

.flat-btn {
  min-width: 38px;
  height: 38px;
  margin-top: 6px;
  line-height: 38px;

  &.active {
    color: #21bec5;
  }
}
</style>
