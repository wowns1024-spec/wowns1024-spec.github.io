"use strict";

function enableCase() {
  const page = document.querySelector("[data-case]");
  if (!page) return;
  const output = page.querySelector("[data-output]");
  const detail = page.querySelector("[data-detail]");
  const values = [...page.querySelectorAll("[data-value]")];
  const groups = [...page.querySelectorAll(".controls[role='group']")];

  function paint(first, second, title, text) {
    values[0].textContent = first;
    values[1].textContent = second;
    output.textContent = title;
    detail.textContent = text;
  }
  const samples = {
  "tingle": [
    [
      "8",
      "9",
      "가입 대기",
      "키링에 적용된 설정이 한 버전 뒤처져 있습니다. 서버가 요구하는 설정을 다시 받아야 합니다."
    ],
    [
      "10",
      "10",
      "매칭 준비 완료",
      "기기와 서버의 버전이 일치하고 가입 상태 조회에서 준비 완료가 확인됐습니다."
    ]
  ],
  "homecam": [
    [
      "1.74%",
      "100%",
      "낮은 기준",
      "말소리 우세 구간 중 1,385개도 기준을 넘었습니다."
    ],
    [
      "0.70%",
      "90%",
      "운영 기본값",
      "말소리 우세 구간 중 기준을 넘은 수가 550개로 줄고, 웃음 우세 구간의 90%가 남았습니다."
    ],
    [
      "0.07%",
      "63%",
      "높은 기준",
      "대화가 기준을 넘는 비율은 더 낮아지지만 웃음 우세 구간에서도 37%가 기준 아래로 내려갑니다."
    ]
  ]
};
  const prompts = [
    ["함정을 설치하세요", "금고를 지키세요"],
    ["침입을 준비하세요", "침입해서 금고를 터세요"]
  ];
  for (const group of groups) {
    for (const control of group.querySelectorAll("button")) {
      control.addEventListener("click", () => {
        for (const other of group.querySelectorAll("button")) other.setAttribute("aria-pressed", String(other === control));
        const selected = groups.map(g => g.querySelector("[aria-pressed='true']"));
        if (page.dataset.case === "getout") {
          const [role, phase] = selected;
          detail.textContent = role.textContent + " · " + phase.textContent;
          output.textContent = prompts[Number(role.dataset.option)][Number(phase.dataset.option)];
        } else {
          paint(...samples[page.dataset.case][Number(control.dataset.option)]);
        }
      });
    }
  }
  if (page.dataset.case === "moa") {
    const advance = page.querySelector("[data-advance]");
    const reset = page.querySelector("[data-reset]");
    const profileResult = page.querySelector("[data-profile-result]");
    const beforeRefresh = ["로그인", "요청 전", "로그인 중", "브라우저에는 로그인할 때 받은 토큰과 사용자 정보가 저장되어 있습니다."];
    const reloading = ["저장된 사용자", "조회 중", "저장한 사용자로 화면 복원", "Vue가 저장된 사용자를 읽고, 토큰을 요청 헤더에 담아 프로필을 조회합니다."];
    const steps = [
      beforeRefresh, reloading,
      ["로그인", "조회 성공", "최신 프로필로 갱신", "서버에서 받은 사용자 정보를 저장하고 화면에 반영합니다."]
    ];
    const failureSteps = [
      beforeRefresh, reloading,
      ["비로그인", "조회 실패", "인증 정보 초기화", "프로필을 불러오지 못해 브라우저에서 토큰과 사용자 정보를 지우고 비로그인 화면을 표시합니다."]
    ];
    let step = 0;
    function update() {
      const states = profileResult.value === "failure" ? failureSteps : steps;
      paint(...states[step]);
      advance.textContent = ["새로고침", "서버 응답 확인", "확인 완료"][step];
      advance.disabled = step === steps.length - 1;
      if (advance.disabled) reset.focus();
    }
    profileResult.addEventListener("change", () => { step = 0; update(); });
    update();
    advance.addEventListener("click", () => { step += 1; update(); });
    reset.addEventListener("click", () => { step = 0; update(); advance.focus(); });
  }
}

enableCase();
