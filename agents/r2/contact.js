/* R2 by Clare — sales team contact (main page and its matching / destiny pages only).
   Unit pages (Riviera2Resale-<CODE>.html) are shared by every agent and do not load this file,
   so no Clare sales number, LINE or e-mail is in them at all (Thor 17 Nov 2026). build.py adds the
   <script> only to pages without window.UNIT_PAGE. */
window.R2_CONTACT = {
  address: {
    th: "29/1128 Commercial 21CU หมู่ 12 ถนนจอมเทียนสาย 2<br>ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150",
    en: "29/1128 Commercial 21CU, Moo 12, Jomtien 2nd Road<br>Nongprue, Banglamung, Chonburi 20150, Thailand"
  },
  phones: [{ name: "Kung", tel: "0661253116" }, { name: "Koy", tel: "0661253117" }],
  emails: [{ name: "Koy", addr: "koy24.clarepattayaproperty@gmail.com" }, { name: "Kung", addr: "kungnuree.clarepattayaproperty@gmail.com" }],
  lines: [{ name: "Koy", id: "koyuni", qr: "riviera-img/line-qr-koy.png" }, { name: "Kung", id: "nureekung", qr: "riviera-img/line-qr-kung.png" }]
};
