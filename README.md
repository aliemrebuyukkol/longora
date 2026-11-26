# Lóngora · v0.8

Çin ve Japon mitolojisi: 12 karakter, 36 keşif noktası, 12 mini oyun, 12 hikâye görevi, 36 kısa hikâye sayfası, 36 soru ve 12 efsane/gerçek kartı.

## Atlas ve müze
Atlas artık animasyonlu, hayalî iki adalı dünya haritası ile açılır. Çin ve Japonya adalarını seçerek karakterlere ve ülke ilerlemesine ulaş. Müze 36 sembolü gösterir; keşfedilmiş eserleri filtrele, favoriye ekle veya sahnede canlandır. Kolay okuma modunun 36 sayfasında mevcut SVG sahnelerinden üretilen hareketli illüstrasyonlar bulunur. Favoriler yerel tarayıcıda saklanır. Harita gerçek coğrafya değildir; illüstrasyonlar bağımsız çizilmiş kitap varlıkları değildir.

## 3B maceralar
Her karakter için üç aşamalı bir keşif rotası vardır. 3B görünümde Maceraya başla düğmesini seç, numaralı sahne işaretlerine veya görev düğmelerine dokun. Karakter belirlenmiş rotada ilerler; ilgili sembol ve efekt açılır. Tamamlanan 12 macera mührü mevcut koleksiyonda saklanır. Sakin hareket modunda hareket anlık gerçekleşir. Bu sistem serbest açık dünya yürüyüşü, fizik tabanlı çarpışma veya navmesh değildir; animasyonlar prosedürel eklem hareketleridir.

## Üç boyutlu keşif
Ana ekrandaki 3B düğmesi ayrı bir diorama görünümü açar. Sürükleyerek veya ok düğmeleriyle döndür, eğim ve yakınlık ayarla. Karakterin üç özelliğine dokun; keşifler mevcut koleksiyona kaydedilir. Ana SVG tasarımı varsayılan olarak korunur. 3B görünüm bağımlılıksız Canvas 2D üzerinde gerçek üç boyutlu mesh projeksiyonu kullanır; WebGL, el boyaması texture, profesyonel GLTF modeller veya iskelet rigleri henüz yoktur. Sakin hareket modu animasyonu kapatır ve yalnızca gerektiğinde yeniden çizer. Normal mod yaklaşık 30 FPS hedefler; gerçek cihaz FPS ölçülmedi.

## Öğrenme
Kolay veya ayrıntılı okuma, isteğe bağlı yerel Türkçe ses, ses efektleri, yüksek kontrast, sakin hareket, kalıcı koleksiyon ve tekrar defteri. Süre sınırı, reklam, zorunlu üyelik yok. İlerleme tarayıcıda saklanır; hosting normal bağlantı kayıtları tutabilir.

## Yayın
GitHub Pages: main / (root). 12 model ve 36 yetenek geometrisi farklı kamera açılarında kod düzeyinde test edildi. Gerçek cihaz görsel ve pedagojik testleri henüz doğrulanmadı.

## Eğitim ve kültür referansları
https://www.w3.org/TR/WCAG22/ — erişilebilirlik hedefleri
https://www.nngroup.com/articles/childrens-websites-usability-issues/ — çocuk UX
https://izumooyashiro.or.jp/en/myths — Izumo anlatıları
https://www.jinjahoncho.or.jp/en/ — Şinto kültürel bağlamı

Anlatılar farklı sürümlere sahiptir. İçerik uzman incelemesine açık bir eğitim prototipidir.
