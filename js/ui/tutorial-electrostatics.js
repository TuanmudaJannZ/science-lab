/**
 * Tutorial steps for the Electrostatics experiment
 * Coulomb's Law: F = k · q₁ · q₂ / r²
 */
export const ELECTROSTATICS_TUTORIAL = [
  {
    title: 'Hukum Coulomb',
    content: 'Charles-Augustin de Coulomb (1785) menemukan bahwa gaya antara dua muatan listrik sebanding dengan besarnya muatan dan berbanding terbalik dengan kuadrat jaraknya — persis seperti gravitasi, tapi bisa tarik-menarik <b>dan</b> tolak-menolak.',
    formula: 'F = k · q₁ · q₂ / r²'
  },
  {
    title: 'Komponen Formula',
    content: '<b style="color:#00d4ff">F</b> = Gaya Coulomb (Newton)<br><b style="color:#00d4ff">k</b> = 8.99 × 10⁹ N·m²/C² (konstanta Coulomb)<br><b style="color:#f43f5e">q₁, q₂</b> = Besar muatan (Coulomb)<br><b style="color:#00d4ff">r²</b> = Kuadrat jarak antar muatan<br><br>Jika q₁·q₂ > 0 → <b style="color:#f43f5e">tolak-menolak</b><br>Jika q₁·q₂ < 0 → <b style="color:#3b82f6">tarik-menarik</b>',
    formula: 'q₁·q₂ > 0  →  Repulsion (+) · (+) atau (−) · (−)'
  },
  {
    title: 'Medan Listrik',
    content: 'Medan listrik <b>E</b> menggambarkan gaya yang akan dialami muatan uji +1C di setiap titik. Garis medan keluar dari muatan positif (+) dan masuk ke muatan negatif (−).<br><br>Semakin rapat garis medan → medan semakin kuat.',
    formula: 'E = F / q = k · Q / r²'
  },
  {
    title: 'Energi Potensial Listrik',
    content: 'Energi potensial sistem muatan adalah total energi yang tersimpan dalam konfigurasi. Berbeda dengan gravitasi, nilainya bisa positif (tolak) atau negatif (tarik).',
    formula: 'U = k · q₁ · q₂ / r'
  },
  {
    title: 'Coba Sekarang! ⚡',
    content: 'Gunakan kontrol untuk bereksperimen:<br>• <b>Klik canvas</b> untuk menempatkan muatan baru<br>• Toggle <b>Field Lines</b> untuk melihat medan listrik<br>• Toggle <b>Heatmap</b> untuk melihat potensial<br>• Coba preset <b>Repulsion</b> dan <b>Chain</b><br>• Amati bagaimana muatan bebas bergerak!'
  }
];
