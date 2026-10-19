"""Product detail pages: data + renderer. Content from tyent.co.in product pages (Oct 2026), edited for clarity."""
import html as H

E = H.escape

# ---------------------------------------------------------------- icons
ICONS = {
 'plates':'<rect x="4" y="3" width="3" height="18" rx="1"/><rect x="10.5" y="3" width="3" height="18" rx="1"/><rect x="17" y="3" width="3" height="18" rx="1"/>',
 'power':'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 'seven':'<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9 15h6"/>',
 'clean':'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
 'qty':'<path d="M7 3h10l-1 18H8z"/><path d="M8 9h8M8 14h8"/>',
 'eco':'<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19l8-8"/>',
 'filter':'<path d="M4 4h16l-6 8v6l-4 2v-8z"/>',
 'turbo':'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
 'dial':'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
 'touch':'<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10 18h4"/>',
 'display':'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
 'rotate':'<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
 'outlet':'<path d="M7 3v6a5 5 0 0 0 10 0V3"/><path d="M9 21v-4M15 21v-4"/>',
 'shield':'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 'h2':'<circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/>',
 'twin':'<rect x="3" y="4" width="7" height="16" rx="2"/><rect x="14" y="4" width="7" height="16" rx="2"/>',
 'voice':'<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
 'leaf':'<path d="M12 21c-5-3-8-7-8-12a8 8 0 0 1 16 0c0 5-3 9-8 12z"/><path d="M12 8v13"/>',
 'drop':'<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
}
def icon(n, s=22):
    return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[n]}</svg>'

# ---------------------------------------------------------------- shared content
WATER = [  # (key, label, pH display, numeric pH, use)
 ('turbo','Turbo','11.5','11.5','Vegetable clean water. Strong alkaline water that lifts pesticide residue, wax and colour coatings from fruit and vegetables.'),
 ('alk3','Alkaline 3','9.5','9.5','Regular drinking water, once your body is used to alkaline water.'),
 ('alk2','Alkaline 2','9.0','9.0','Moderate drinking water. A step up from your first weeks.'),
 ('alk1','Alkaline 1','8.5','8.5','Initial drinking water. Where every new Tyent family starts.'),
 ('h2o','Purified','7.0','7.0','Filtered, neutral water. Use it to take medicines and make baby food.'),
 ('acd2','Acidic 2','5–5.5','5.2','Beauty water. Gentle on skin and hair, as a toner or final rinse.'),
 ('acd1','Acidic 1','4–5','4.5','Surface cleaner for counters, glass and kitchen tops.'),
]
WC = {'turbo':'#4E4BD8','alk3':'#3B6FE0','alk2':'#29AAE2','alk1':'#3CC2C4','h2o':'#2FB36E','acd2':'#F09A3A','acd1':'#E5483B'}
DISPLAY = [('Water buttons',['Turbo water (11.5 pH)','Acidic level 2 (5–5.5 pH)','Acidic level 1 (4–5 pH)','Purified water (7 pH)','Alkaline level 1 (8.5 pH)','Alkaline level 2 (9 pH)','Alkaline level 3 (9.5 pH)']),
           ('Live readouts',['Time','pH','Water flow rate','Voltage / flow / time','Remaining time']),
           ('Alerts',['Door open','Temperature error']),
           ('Functions',['Fixed quantity discharge','System setup','Manual cleaning','Voice on / off','1st filter indicator & reset','2nd filter indicator & reset'])]

def F_plates(n, orp): return ('plates', f'{n} Japanese plates', f'{n} solid hybrid mesh plates from Permelec, Japan (making electrodes since 1969): titanium coated in 99.9% pure platinum. Stable oxygen levels, ORP up to −{orp} mV* and fine micro-clustering, with a 15-year plate warranty and a 45+ year lifespan.')
F_POWER = ('power','Patented SMPS PLUS power','55+ adjustable power settings keep output steady. Designed only for Tyent, it reaches strong alkaline (11.5 pH) and strong acidic (2.5 pH) water without chemicals, and protects the machine over its long life.')
F_SEVEN = ('seven','7 water levels','A continuous stream of seven waters, from strong alkaline 11.5 pH to strong acidic 2.5 pH, for drinking, cooking, cleaning and skin care.')
F_PAST = ('clean','PAST auto-cleaning','Polarity Anti Scale Technology reverses the charge on a timer and by sensor, so minerals do not build up on the plates and hydrogen output stays high.')
F_QTY = ('qty','Fixed quantity output','Pour exactly 0.5 L, 1.0 L or 1.5 L at a touch. Measured water for cooking, flasks and baby bottles.')
F_ECO = ('eco','ECO mode','The LCD backlight switches off when the machine is idle, saving up to 99.9% of standby power.')
F_FILT = ('filter','Real-time filter indicator','The display tracks how much each filter has left and tells you when it is time to change it.')
F_TURBO = ('turbo','Turbo mode','The only ionizer that reaches 11.5 pH without chemicals, salts or enhancers, thanks to SMPS PLUS. Ideal for washing fruit and vegetables.')
F_JOG = ('dial','Jog dial','Rotate and click to choose your pH. A soft LED changes colour with the water that is flowing.')
F_ONE = ('display','One-touch display','Clear icons for every water. Touch once to start or stop the flow, with voice confirmation.')

NMP_FEATS = lambda n, orp, extra: [F_plates(n, orp), F_POWER, F_SEVEN, F_PAST, F_QTY, F_ECO, F_FILT, F_TURBO, extra]

UCE_EXTRAS = [
 ('touch','Touchscreen + jog dial faucet','A smartphone-style touchscreen and a jog dial on the faucet. Use whichever you prefer.'),
 ('display','Customisable display','The first ionizer with a choice of display styles: full colour or night mode.'),
 ('rotate','Rotates 180° and more','The faucet turns in many directions, so it suits any sink layout.'),
 ('outlet','Separate outlets','Alkaline and acidic water leave through their own outlets, so they never mix.'),
]
UCE_SAFETY = [('Automatic stop','Flow stops on its own to prevent overflow. You can pour again straight away.'),
              ('Temperature sensor','Stops hot water from entering the machine by accident.'),
              ('Raw water sensing','If the supply runs dry, the machine stops to protect the cell and power supply and to prevent leaks.'),
              ('Filter door detection','Water stops automatically while the filter door is open.')]

def nmp_specs(n, price, orp, h2):
    return [
     ('Performance',[('Model',None),('Electrode / plates',str(n)),('pH range','2.5 – 11.5*'),('ORP range',f'Up to −{orp} mV*'),('Hydrogen',f'Up to {h2} ppb*'),('Water levels','7: 3 alkaline, 2 acidic, 1 neutral, 1 turbo (11.5 pH)'),('Plate surface area',f'52.9 × {n} = {52.9*n:.1f} sq in'),('Output','1.5 – 3.0 L/min')]),
     ('Filtration',[('Filters','2 filters, NSF, EPA & ANSI certified'),('Composition','Carbon block, UF, TM ceramics, membrane & calcium sulfite'),('Filter capacity','8,500 L'),('Chemicals or salt added','None')]),
     ('Build & power',[('Electrode design','Solid hybrid mesh (titanium & platinum)'),('Electrode material','Platinum-coated titanium'),('Plate purity','99.9% (Permelec, Japan)'),('Power supply','Patented SMPS PLUS'),('Power consumption','Max 220 W'),('Voltage','200 – 240 V, 50–60 Hz'),('Display','One-touch LCD'),('Voice confirmation','Yes'),('Dimensions','300 (W) × 135 (D) × 355 (H) mm'),('Weight','5.2 kg'),('Installation','Countertop or wall-mounted'),('Dispensing','Tankless, touch button, fully automatic'),('Cleaning','Automatic (PAST technology)')]),
     ('Service & safety',[('Warranty','3 years on the ionizer, 15 years on the plates'),('Service','3 services a year: 9 free services in the 3-year warranty, pan-India'),('Safety','Water temperature, supply water, overheating and error sensors'),('Input water needed','TDS 90 – 160, pH 7, pressure 5 – 7 L/min'),('Manufacturer','Taeyoung E&T Co., Ltd, Yangsan-si, Gyeongsangnam-do, Korea')]),
    ]

def uce_specs(n, orp, h2):
    s = nmp_specs(n, 0, orp, h2)
    b = dict(s[2][1])
    s[2] = ('Build & power',[(k, v) for k, v in s[2][1] if k not in ('Dimensions','Weight','Installation','Display')] + [('Display','Touchscreen faucet with jog dial'),('Installation','Under-counter; only the faucet shows'),('Faucet finishes','Satin Silver, Matte Black, Gold, Antique')])
    return s

GAL_NMP57 = [('nmp57','NMP-5 and NMP-7',1),('edge-screen','The LCD up close',0),('edge-angle','Side profile',0),('life-edge','In the kitchen',0),('life-turbo','Washing vegetables in turbo water',0),('life-sleep','First glass of the day',0)]
GAL_NMP9 = [('nmp9','NMP-9 and NMP-11',1),('edge-screen','The LCD up close',0),('edge-angle','Side profile',0),('life-edge','In the kitchen',0),('life-alkali','Alkaline water after a workout',0),('life-dog','Fresh water for pets too',0)]
GAL_UCE = [('uce-set2','Ionizer with its faucet',1),('uce-set','Satin Silver set',1),('uce-touch','Faucet touchscreen',1),('uce-gold-situ','Gold faucet on marble',0),('uce-outlet','Matte Black faucet pouring',0),('uce-box','The ionizer unit',1)]
FIN = [('Satin Silver','#C9CDD3','f-silver'),('Matte Black','#1B1D21','f-black'),('Gold','#C9A85E','f-gold'),('Antique','#7A5A48','f-antique')]

NMP_LINE = [('nmp-5','NMP-5',5,850,1550,168000,'2–3 people'),('nmp-7','NMP-7',7,950,1550,205000,'4–5 people'),('nmp-9','NMP-9',9,1050,1800,238000,'Larger families'),('nmp-11','NMP-11',11,1150,1800,272000,'Heavy daily use')]
UCE_LINE = [('uce-9-plus','UCE-9 Plus',9,1050,1800,325000,'Most homes'),('uce-11-plus','UCE-11 Plus',11,1150,1800,346000,'Larger families'),('uce-13-plus','UCE-13 Plus',13,1250,1800,367000,'Maximum output')]

COMMON_FAQ_WARRANTY = 'Every machine comes with a 3-year warranty on the ionizer and a 15-year warranty on the plates, plus 3 services a year (9 free services across the warranty period), anywhere in India. Confirm the full terms with Tyent India when you order.'

# ---------------------------------------------------------------- products
P = {}

def nmp(slug, name, n, orp, h2, price, fam, kicker, sub, intro, img, gal, extra, story, faq, related):
    P[slug] = dict(slug=slug, key=slug.replace('-',''), name=name, name_html=name.replace('-', '-<em>', 1) + '</em>', series='NMP Series', family='nmp',
      kicker=kicker, tags=['Countertop', f'{n} plates'], sub=sub, intro=intro, price=price, img=img, gal=gal,
      stats=[(str(n),'','Japanese platinum plates'),(str(orp),'−','mV ORP, up to*'),(str(h2),'','ppb hydrogen, up to*'),('7','','water levels, 2.5 – 11.5 pH*')],
      plates=n, feats=NMP_FEATS(n, orp, extra), water=True, display=True, specs=nmp_specs(n, price, orp, h2),
      compare=('nmp', NMP_LINE), story=story, faq=faq, related=related)

nmp('nmp-5','NMP-5',5,850,1550,168000,'nmp','The ideal first ionizer','Countertop hydrogen-rich alkaline water ionizer',
 'Five Japanese plates, seven waters and a simple one-touch display. The NMP-5 brings Tyent technology to smaller kitchens and smaller families, and sits neatly beside the sink.',
 'nmp57', GAL_NMP57, F_ONE,
 [('Who it is for','The NMP-5 suits small and medium kitchens and nuclear families of two or three. It gives you an unlimited supply of clean, antioxidant water, so you can stop buying bottled water.'),
  ('Five plates, full Tyent performance','Its five platinum-coated titanium plates from Permelec, Japan, give excellent conductivity and are built for a 45-year lifespan. You get the same seven waters, turbo mode and auto-cleaning as the larger models.'),
  ('pH, ORP and hydrogen','The NMP-5 reaches 2.5 to 11.5 pH, an ORP of up to −850 mV and up to 1,550 ppb of molecular hydrogen*. Turbo mode makes its strongest waters without chemicals or salts.'),
  ('Dual .01 micron filtration','Two certified filters catch bacteria, viruses, chlorine and heavy metals, and keep the natural minerals your body needs.'),
  ('Easy countertop installation','The tankless machine sits next to your sink and connects to your tap line. The LCD is simple to read and voice prompts confirm every selection.'),
  ('A transparent price','Tyent sells through its own team, not multi-level marketing, so the price pays for the technology and the service, not for commissions. Turbo mode also never needs the chemical enhancers some machines use to reach extreme pH.')],
 [('How many plates does the NMP-5 have?','Five platinum-coated titanium solid hybrid mesh plates from Japan, giving efficient electrolysis and steady hydrogen output.'),
  ('What pH range does the NMP-5 produce?','From 2.5 to 11.5 pH*, across seven waters for drinking, cooking and cleaning.'),
  ('Is the NMP-5 right for a family of 2–3?','Yes. It is our starting model for nuclear families, and the tankless design is easy to use every day.'),
  ('What is the price of the NMP-5 in India?','The M.R.P. is ₹1,68,000, with no network-marketing commissions built in.'),
  ('How does the NMP-5 compare with the NMP-7?','The NMP-7 has seven plates and a stronger ORP of up to −950 mV, which suits a larger family. The NMP-5 is the more affordable five-plate choice. The NMP-9 and NMP-11 go further still.'),
  ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 ['nmp-7','nmp-9','uce-9-plus'])

nmp('nmp-7','NMP-7',7,950,1550,205000,'nmp','The perfect household ionizer','Countertop hydrogen-rich alkaline water ionizer',
 'Seven Japanese plates and up to 3 litres a minute. The NMP-7 is the balanced middle of the range: strong enough for a family of four or five, priced well below the flagships.',
 'nmp57', GAL_NMP57, F_ONE,
 [('Best for mid-size families','Up to 3 litres a minute is plenty for a family of four or five, with enough water for drinking, cooking, washing vegetables and cleaning.'),
  ('Seven plates, better ORP','Seven 99.9% pure platinum-coated titanium plates give a larger surface area than the NMP-5, for more stable conductivity, finer micro-clustering and a higher ORP.'),
  ('pH, ORP and hydrogen','Seven waters from 2.5 to 11.5 pH, an ORP of up to −950 mV and up to 1,550 ppb of antioxidant molecular hydrogen*.'),
  ('Where it sits in the range','The NMP-5 reaches −850 mV ORP and the NMP-9 −1050 mV. The NMP-7 offers much more antioxidant capacity than the NMP-5, for families not yet ready for the NMP-11.'),
  ('Set up without a plumber','The tankless body sits beside the sink and connects to your faucet line. The LCD and voice confirmation keep everyday use simple.'),
  ('Service in 650+ cities','Tyent covers more than 650 cities in India. Technicians change your filters and look after the machine through its long life.')],
 [('What is the difference between the NMP-7 and NMP-9?','The NMP-9 has nine plates, an ORP of up to −1050 mV and more molecular hydrogen. The NMP-7 has seven plates and up to −950 mV.'),
  ('How many plates does the NMP-7 have?','Seven solid hybrid mesh plates of platinum-coated titanium, made by Permelec, Japan.'),
  ('Is the NMP-7 good for daily family use?','Yes. At up to 3.0 L/min it covers drinking, cooking and cleaning for a medium-sized family.'),
  ('What is the price of the NMP-7 in India?','The M.R.P. is ₹2,05,000, with no multi-level marketing fees.'),
  ('Does the NMP-7 remove fluoride and chlorine?','The dual .01 micron filters remove chlorine, heavy metals and bacteria. Electrolysis does not remove dissolved minerals such as fluoride, so on high-TDS water we pair the machine with an RO pre-filter.'),
  ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 ['nmp-5','nmp-9','nmp-11'])

nmp('nmp-9','NMP-9',9,1050,1800,238000,'nmp','Our best-selling countertop model','Countertop hydrogen-rich alkaline water ionizer',
 'Nine Japanese plates, up to 1,800 ppb hydrogen and a sleek countertop body. The NMP-9 is the model most Tyent families choose.',
 'nmp9', GAL_NMP9, F_ONE,
 [('Our most popular countertop model','Families trust the NMP-9 for consistent performance and excellent water. It makes alkaline, acidic and hydrogen-rich water to match every part of your day.'),
  ('Built for larger families','The NMP-9 is designed for homes that use a lot of water. It keeps pouring fresh alkaline, hydrogen-rich water without losing performance.'),
  ('Nine plates for higher alkalinity','Nine platinum-coated titanium plates raise ionization efficiency, for more alkaline and hydrogen-rich water through the day.'),
  ('pH, ORP and hydrogen','Seven waters from 2.5 to 11.5 pH, a strong ORP of up to −1050 mV and up to 1,800 ppb of molecular hydrogen*.'),
  ('NMP-9 or UCE-9 Plus?','Both have nine plates. The NMP-9 sits on the counter and installs in minutes. The UCE-9 Plus hides under the sink and leaves only a faucet.'),
  ('How ordering works','Choose your model and send an order request. Our team confirms the price and payment, delivers to your door and installs the machine.')],
 [('How is the NMP-9 different from the NMP-7?','Nine plates instead of seven give higher ionization efficiency and more hydrogen, which suits homes that drink more water.'),
  ('Is a 9-plate ionizer better than a 7-plate one?','Generally yes: more plates give stronger ionization and more hydrogen, with steady performance over the long term.'),
  ('What pH levels can the NMP-9 make?','From 2.5 to 11.5 pH*: alkaline, neutral and acidic waters for drinking, cooking, food preparation and cleaning.'),
  ('Is the NMP-9 suitable for large Indian families?','Yes. Its high output and nine-plate cell keep up with greater daily water needs.'),
  ('What is the price of the NMP-9 in India?','The M.R.P. is ₹2,38,000.'),
  ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 ['nmp-7','nmp-11','uce-9-plus'])

nmp('nmp-11','NMP-11',11,1150,1800,272000,'nmp','The ultimate countertop ionizer','Countertop hydrogen-rich alkaline water ionizer',
 'Eleven Japanese plates, the highest performance in the NMP Series and a jog dial that glows with your water. Under-counter power, on your countertop.',
 'nmp9', GAL_NMP9, F_JOG,
 [('The top of the NMP Series','Eleven plates, intelligent controls and the best filtration in the series. The NMP-11 delivers under-counter performance with no plumbing changes.'),
  ('Eleven-plate Japanese technology','Its Japanese electrode technology gives stable output even when your source water changes, with enhanced electrolysis and long-term reliability.'),
  ('pH, ORP and hydrogen','Seven waters from 2.5 to 11.5 pH, an ORP of up to −1150 mV and up to 1,800 ppb of molecular hydrogen*.'),
  ('Best for','Health enthusiasts, athletes, growing families and anyone who drinks more water each day.'),
  ('NMP-11 or UCE-11 Plus?','Both have eleven plates. Choose the NMP-11 for a countertop machine, or the UCE-11 Plus to hide the machine under the sink.'),
  ('Delivery and support across India','Pan-India delivery, expert advice and responsive after-sales service, backed by a strong warranty.')],
 [('What makes the NMP-11 the top NMP model?','Eleven plates, the best filtration in the series, intelligent controls and the highest output, for efficient, reliable daily use.'),
  ('How many plates does the NMP-11 have?','Eleven platinum-coated titanium plates, giving stable alkaline, acidic and purified water every day.'),
  ('Who should choose the NMP-11 over the NMP-9?','Larger families, athletes and homes that drink more water. The extra plates add capacity and efficiency.'),
  ('What is the price of the NMP-11 in India?','The M.R.P. is ₹2,72,000. Our team confirms current offers when you order.'),
  ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 ['nmp-9','uce-11-plus','hybrid-h2'])

def uce(slug, name, n, orp, h2, price, sub, intro, story, faq, related):
    P[slug] = dict(slug=slug, key=('uce' if n == 13 else 'uce' + str(n)), name=name, name_html=name.replace(' Plus', ' <em>Plus</em>'), series='UCE Plus Series', family='uce',
      kicker='Luxury kitchen range', tags=['Under-counter', f'{n} plates', '4 finishes'], sub=sub, intro=intro, price=price, img='uce-set2', gal=GAL_UCE, fin=FIN,
      stats=[(str(n),'','Japanese platinum plates'),(str(orp),'−','mV ORP, up to*'),(str(h2),'','ppb hydrogen, up to*'),('7','','water levels, 2.5 – 11.5 pH*')],
      plates=n, feats=[F_plates(n, orp), F_POWER, F_PAST, F_TURBO, F_ECO, F_QTY, F_FILT] + UCE_EXTRAS, safety=UCE_SAFETY, water=True, display=True,
      specs=uce_specs(n, orp, h2), compare=('uce', UCE_LINE), story=story, faq=faq, related=related)

uce('uce-9-plus','UCE-9 Plus',9,1050,1800,325000,'Under-counter hydrogen-rich alkaline water ionizer',
 'Hidden below, with only a slim faucet on show. Nine Japanese plates, a touchscreen and jog dial on the faucet, and four finishes for a premium kitchen.',
 [('Clean looks, powerful performance','The machine sits out of sight under the counter and uses none of your kitchen space, yet delivers ionized water whenever you need it.'),
  ('Nine plates, hidden','Nine long-lasting platinum-coated titanium plates give steady performance, entirely concealed below your countertop.'),
  ('pH, ORP and hydrogen','Seven waters from 2.5 to 11.5 pH, an ORP of up to −1050 mV and up to 1,800 ppb of molecular hydrogen*.'),
  ('Made for modern Indian kitchens','Only the faucet and its controls show, so your counters stay clear without losing any convenience.'),
  ('Professional installation','Our technicians install every UCE so it performs well from day one, with advice and support across India.'),
  ('UCE-9 Plus or NMP-9?','The same nine plates either way. Choose the UCE-9 Plus to hide the machine, or the NMP-9 to keep it on the counter. Need more output? See the UCE-11 Plus and UCE-13 Plus.')],
 [('How is the UCE-9 Plus different from countertop models?','The main unit is hidden in your kitchen cabinet, so you get full performance and keep your counter clear.'),
  ('Does it need professional installation?','Yes. Our technicians connect the plumbing correctly so the ionizer runs safely and efficiently.'),
  ('How many plates does it have?','Nine premium platinum-coated titanium plates.'),
  ('Is it suitable for hard water?','With the right filtration and regular maintenance it works well across many water conditions. Filters may need changing more often depending on your water. A free water test tells you what to expect.'),
  ('What is the price of the UCE-9 Plus in India?','The M.R.P. is ₹3,25,000. Our team confirms installation details when you order.'),
  ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 ['uce-11-plus','uce-13-plus','nmp-9'])

uce('uce-11-plus','UCE-11 Plus',11,1150,1800,346000,'Under-counter hydrogen-rich alkaline water ionizer',
 'Eleven Japanese plates hidden under the sink, a smart faucet above it. More output than the UCE-9 Plus, with the same clean, uncluttered counter.',
 [('Premium under-counter performance','For homeowners who want the best without giving up a beautiful kitchen. The machine fits under the sink and keeps high-quality alkaline water flowing.'),
  ('Eleven plates for alkalinity and hydrogen','Large platinum-coated titanium plates handle heavy daily use with high ionization efficiency, for drinking, cooking and every meal in between.'),
  ('pH, ORP and filtration','Seven waters from 2.5 to 11.5 pH, an ORP of up to −1150 mV and up to 1,800 ppb hydrogen*. Multi-stage filtration removes common impurities before ionization.'),
  ('Best for','Premium homes, large families and health enthusiasts who use more water.'),
  ('UCE-11 Plus or UCE-9 Plus?','Both perform beautifully. The UCE-11 Plus adds ionization capacity and output for bigger households.'),
  ('Delivery and installation','Nationwide delivery and professional installation, with a product expert to guide you.')],
 [('How is the UCE-11 Plus better than the UCE-9 Plus?','Two more plates give higher ionization efficiency and more daily output, ideal for larger families.'),
  ('Is an 11-plate ionizer worth the extra?','For families who want top results, yes: more efficient ionization, higher output and long-lasting performance.'),
  ('Does it work with all Indian water sources?','It suits most municipal supplies. Our experts set up the right filtration for your local water at installation.'),
  ('What is the price of the UCE-11 Plus in India?','The M.R.P. is ₹3,46,000.'),
  ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 ['uce-9-plus','uce-13-plus','nmp-11'])

uce('uce-13-plus','UCE-13 Plus',13,1250,1800,367000,'Under-counter hydrogen-rich alkaline water ionizer',
 'The most powerful Tyent for the home. Thirteen Japanese plates under the sink, a touchscreen faucet above it, in Satin Silver, Matte Black, Gold or Antique.',
 [('The most powerful ionizer in India','Designed for those who want the best every day: stable alkaline water, more hydrogen and consistent operation, from a trusted Japanese-engineered machine.'),
  ('Thirteen-plate Japanese technology','The highest plate count in the range gives the best electrolysis efficiency, flexible pH and an ORP of up to −1250 mV*.'),
  ('pH, hydrogen and filtration','Seven waters from 2.5 to 11.5 pH and up to 1,800 ppb hydrogen*, with intelligent filtration that cleans the water before ionization.'),
  ('Best for','Athletes, active families, professionals and premium homes that want the strongest ionization.'),
  ('Is the upgrade from UCE-11 Plus worth it?','Same design, two more plates: more electrolysis efficiency and hydrogen capacity for maximum, flagship-level output.'),
  ('White-glove installation','Professional setup, pan-India delivery, expert guidance and dedicated after-sales support.')],
 [('What makes the UCE-13 Plus the most powerful Tyent?','Thirteen Japanese plates, optimised electrolysis, more hydrogen, advanced filtration and intelligent controls.'),
  ('Who should buy the UCE-13 Plus?','Large families, health-conscious people, athletes and premium homes that want the highest output.'),
  ('How many plates does it have?','Thirteen platinum-coated titanium plates.'),
  ('What is the price of the UCE-13 Plus in India?','The M.R.P. is ₹3,67,000, the same for every faucet finish.'),
  ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 ['uce-11-plus','hybrid-h2','nmp-11'])

P['hybrid-h2'] = dict(slug='hybrid-h2', key='hybrid', name='H2-Hybrid', name_html='H2-<em>Hybrid</em>', series='Hydrogen', family='hybrid',
 kicker='Patented twin-cell technology', tags=['Countertop','Twin cell','Black box edition'], sub='Ionizer and hydrogen water generator in one',
 intro='Two water cells in one machine. One makes seven ionized waters from 11.5 to 2.5 pH; the other makes hydrogen-rich water at a neutral pH. The world\'s only black box edition with patented twin-cell technology.',
 price=367000, img='hybrid',
 gal=[('hybrid','H2-Hybrid front',1),('hybrid-dial','The H2 jog dial',0),('hybrid-close','Side profile',0),('cell','The water cell',1),('life-sleep','Morning glass',0),('life-mom','At home with family',0)],
 stats=[('2','','water cells, one machine'),('1250','−','mV ORP, up to*'),('1850','','ppb hydrogen, up to*'),('7','','water levels, 2.5 – 11.5 pH*')],
 feats=[('twin','Japanese twin-cell technology','Patented twin cells make high levels of molecular hydrogen and antioxidants: up to 1,850 ppb hydrogen and −1250 mV ORP*, with a 15-year warranty and 45+ year lifespan.'),
        F_POWER,
        ('display','Largest full-colour display','The industry\'s largest, most advanced full-colour LCD, with voice prompts. One touch selects any of the 7 waters.'),
        F_TURBO,
        ('h2','H2 button and jog dial','Turn the dial to make targeted antioxidant hydrogen water at a neutral pH, separate from the ionizer.'),
        ('clean','PAST auto-cleaning','Timer and sensor cleaning, plus automatic flow switching that keeps the water cell clean and prevents scale.'),
        F_QTY, F_FILT,
        ('eco','ECO mode','Turns off the LCD backlight when idle, saving up to 99% of standby power.')],
 hybrid=True, water=True, display=True,
 specs=[('Performance',[('Model',None),('Electrode type','Twin-cell technology'),('pH range','2.5 – 11.5*'),('ORP range','Up to −1250 mV*'),('Hydrogen','Up to 1,850 ppb*'),('Water levels','7: 3 alkaline, 2 acidic, 1 neutral, 1 turbo (11.5 pH)'),('Output','1.5 – 3.0 L/min')]),
        ('Filtration',[('Filters','2 filters, NSF, EPA & ANSI certified'),('Composition','Carbon block, UF, TM ceramics, membrane & calcium sulfite'),('Filter capacity','8,500 L'),('Chemicals or salt added','None')]),
        ('Build & power',[('Electrode material','Platinum-coated titanium'),('Plate purity','99.9% (Permelec, Japan)'),('Power supply','Patented SMPS PLUS'),('Power consumption','Max 220 W'),('Voltage','200 – 240 V, 50–60 Hz'),('Display','Full-colour one-touch LCD + H2 jog dial'),('Voice confirmation','Yes'),('Installation','Countertop'),('Dispensing','Tankless, touch button, fully automatic'),('Cleaning','Automatic (PAST) with flow switching'),('Patents','PCT/KR2017/011890 · 10-2017-00903670')]),
        ('Service & safety',[('Warranty','3 years on the ionizer, 15 years on the electrodes'),('Service','3 services a year: 9 free services in the 3-year warranty, pan-India'),('Safety','Water temperature, supply water, overheating and error sensors'),('Input water needed','TDS 90 – 160, pH 7, pressure 5 – 7 L/min'),('Manufacturer','Taeyoung E&T Co., Ltd, Yangsan-si, Gyeongsangnam-do, Korea')])],
 story=[('The future of hydrogen water','For people who want the newest thinking in healthy water. The H2-Hybrid makes water rich in molecular hydrogen, and is a stylish, high-value addition to a modern Indian home.'),
        ('Hydrogen water vs alkaline water','Alkaline water is about raising pH and mineral content. Hydrogen water is about dissolved molecular hydrogen, which is being studied for its antioxidant properties. The H2-Hybrid gives you both, from one machine.'),
        ('How it makes hydrogen water','A separate hydrogen chamber with PEM (Proton Exchange Membrane) technology infuses filtered water with molecular hydrogen at a neutral pH, efficiently and with little maintenance.'),
        ('Best for','Athletes, busy professionals and families who want deeper hydration. Many active people make hydrogen water part of their recovery.'),
        ('What makes it unique','A dedicated hydrogen cell alongside a full Tyent ionizer, in patented twin-cell engineering. Compare it with any other machine and that is the difference.'),
        ('Delivery and installation','Delivery and installation in most Indian cities. Technicians set it up, demonstrate it and show you daily use.')],
 faq=[('What is the difference between hydrogen water and alkaline water?','Hydrogen water carries dissolved molecular hydrogen; alkaline water is about pH and minerals. The H2-Hybrid makes both.'),
      ('Is the H2-Hybrid suitable for daily drinking?','Yes. It is designed for everyday household hydration. Regular maintenance keeps performance and water quality high.'),
      ('What ORP and hydrogen levels does it produce?','Up to −1250 mV ORP and up to 1,850 ppb hydrogen*. Actual levels depend on your source water, flow rate and maintenance.'),
      ('Who should choose the H2-Hybrid over the NMP or UCE series?','Anyone who wants dedicated hydrogen-water technology as well as a full ionizer. For ionized water alone, a countertop NMP or under-counter UCE is a great choice.'),
      ('What is the price of the H2-Hybrid in India?','The M.R.P. is ₹3,67,000. Our team confirms offers and installation when you order.'),
      ('What warranty comes with it?', COMMON_FAQ_WARRANTY)],
 related=['uce-13-plus','nmp-11','ace-13'])

P['ace-13'] = dict(slug='ace-13', key='ace', name='ACE-13', name_html='ACE-<em>13</em>', series='Countertop flagship', family='ace',
 kicker='Every water, one touch away', tags=['Countertop','13 plates','Touchscreen'], sub='Countertop flagship water ionizer',
 intro='Thirteen plates and a full-colour touchscreen on your counter. Turn the jog dial or tap the screen, and the ACE-13 shows the pH before you pour.',
 price=None, img='ace',
 gal=[('ace','ACE-13 three-quarter view',1),('ace-front','ACE-13 front',1),('ace-touch','Touchscreen in use',0),('ace-jog','The jog dial',0),('ace-screens','Screen menus',0),('life-baby','Measured water for a baby bottle',0)],
 stats=[('13','','platinum-coated plates'),('7','','water levels*'),('2','','stage filtration'),('15','','year plate warranty')],
 plates=13,
 feats=[('plates','13 platinum plates','The most plates on any Tyent countertop machine, for strong, steady ionization.'),
        ('touch','Colour touchscreen','Pick any of seven waters and see the pH before you pour.'),
        F_JOG, F_POWER, F_SEVEN, F_PAST, F_TURBO, F_QTY,
        ('filter','Two-stage filters','Carbon and ultra-filtration stages sit behind the front panel and are easy to change.')],
 water=True, display=False,
 specs=[('At a glance',[('Model',None),('Installation','Countertop'),('Plates','13 platinum-coated titanium'),('Controls','Colour touchscreen and jog dial'),('Water levels','7, from acidic to turbo'),('Filtration','Two-stage filters'),('Cleaning','Automatic (PAST technology)'),('Power supply','Patented SMPS PLUS')])],
 specs_note='Full specification sheet, ORP and hydrogen figures to be confirmed by Tyent India.',
 story=[('Made to be on show','A flagship for families who want the best on their counter. Touchscreen, jog dial and a flexible spout that swings to fill a glass, a jug or a pot.'),
        ('Thirteen plates on the counter','The same plate count as our most powerful under-counter machine, without any under-sink installation.'),
        ('Ask for a home demo','See the ACE-13 at home before you decide. A Tyent specialist will test your water and show you every setting.')],
 faq=[('How many plates does the ACE-13 have?','Thirteen platinum-coated titanium plates.'),
      ('What is the price of the ACE-13?','Price on request. Our team confirms the current price when you order or call.'),
      ('Countertop or under-counter?','The ACE-13 sits on your counter. For the same plate count hidden under the sink, see the UCE-13 Plus.'),
      ('What warranty comes with it?','Confirm warranty and service terms with Tyent India when you order.')],
 related=['uce-13-plus','nmp-11','hybrid-h2'])

P['q-series'] = dict(slug='q-series', key='q', name='Q-Series', name_html='Q-<em>Series</em>', series='Countertop', family='q',
 kicker='Soft lines. Simple settings.', tags=['Countertop','Eco mode'], sub='Compact countertop water ionizer',
 intro='A rounded, compact design with colour-coded water settings the whole family can read at a glance, and an eco mode that saves power between pours.',
 price=None, img='q',
 gal=[('q','Q-Series with eco mode',1),('q-front','Front view',0),('q-screens','Water settings',1),('life-q1','Everyday use',0),('life-q2','Rinsing with acidic water',0),('life-water','A glass at home',0)],
 stats=[('7','','colour-coded waters*'),('2','','stage filtration'),('1','','touch to pour'),('0','','chemicals added')],
 feats=[('display','Colour-coded panel','Every water type has its own colour, so anyone at home can choose the right one.'),
        F_ECO, F_SEVEN, F_PAST, F_POWER,
        ('filter','Two-stage filters','Filtration before the plates, with genuine replacements delivered to your door.')],
 water=True, display=False,
 specs=[('At a glance',[('Model',None),('Installation','Countertop'),('Controls','Soft-touch, colour-coded panel'),('Power','Eco mode'),('Design','Compact, rounded body'),('Filtration','Two-stage filters')])],
 specs_note='Plate count and full specifications to be confirmed by Tyent India.',
 story=[('Simple by design','Soft lines and a small footprint for compact kitchens, with settings that need no explaining.'),
        ('Ask our team','Tell us about your household and your water, and we will tell you whether the Q-Series or an NMP model suits you best.')],
 faq=[('What is the price of the Q-Series?','Price on request. Our team confirms it when you order or call.'),
      ('How is it different from the NMP Series?','The Q-Series is about simplicity and a compact, rounded design. The NMP Series lets you choose 5 to 11 plates.')],
 related=['nmp-5','nmp-7','ace-13'])

P['filters'] = dict(slug='filters', key='filters', name='Replacement filters', name_html='Replacement <em>filters</em>', series='Filters & accessories', family='care',
 kicker='.01 micron · NSF, EPA & ANSI certified', tags=['Stage 1 + stage 2','Genuine Tyent'], sub='Genuine Tyent two-stage filter set',
 intro='Tyent Extreme .01 micron filters remove even the toughest contaminants, such as arsenic and chromium VI, before water reaches the plates. Your machine tells you when it is time for a new set.',
 price=None, img='filters', gal=[('filters','Stage 1 and stage 2 filters',1)],
 stats=[('.01','','micron filtration'),('8500','','litres per filter'),('2','','filtration stages'),('3','','certifications: NSF, EPA, ANSI')],
 feats=[('filter','Removes the toughest contaminants','Heavy metals, pharmaceuticals, heavy contamination, micro-organisms, bacteria, viruses, algae and fungi.'),
        ('leaf','Keeps healthy minerals','Natural calcium and magnesium stay in the water, so the ionizer has minerals to work with.'),
        ('shield','Certified','NSF, EPA and ANSI certified filters, made for Tyent machines.'),
        ('display','Real-time reminder','Your machine\'s display tracks each filter and tells you when to change it.')],
 specs=[('Filter set',[('Structure','2 filters (stage 1 + stage 2)'),('Rating','.01 micron'),('Composition','Carbon block, UF, TM ceramics, membrane & calcium sulfite'),('Capacity','8,500 L'),('Certified','NSF, EPA & ANSI'),('Fits','Tell us your model and we send the matching set')])],
 story=[('Delivered and fitted','Order a set and we deliver genuine filters to your door. Our technicians can fit them during your next service.')],
 faq=[('How often should I change filters?','Each filter is rated for about 8,500 litres. Your machine\'s filter indicator tells you when to change it; hard or poor-quality water may shorten that.'),
      ('Which filters fit my machine?','Tell us your model when you order and we send the matching set.')],
 related=['scale-remover','tm-x-soap','nmp-9'])

P['scale'] = dict(slug='scale-remover', key='scale', name='Scale Remover', name_html='Scale <em>Remover</em>', series='Filters & accessories', family='care',
 kicker='For hard-water cities', tags=['Accessory','Hard water'], sub='Protects plates and pipes from calcium build-up',
 intro='Tyent machines are designed for input water with a TDS of 90 to 160. In hard-water areas, the Tyent Scale Remover guards the plates and pipes against calcium build-up and helps your machine last.',
 price=None, img='scale', gal=[('scale','Tyent Scale Remover unit',0)],
 stats=[('90','','TDS: lowest recommended input'),('160','','TDS: highest recommended input'),('0','','chemicals added to your water'),('1','','free water test first')],
 feats=[('shield','Protects the plates','Less scale on the electrodes means steadier ionization and more hydrogen.'),
        ('clean','Works with PAST cleaning','Pairs with your machine\'s automatic cleaning in hard-water areas.'),
        ('drop','Tested first','Our free water test tells you whether your home needs it.')],
 specs=[('Scale Remover',[('Use','Hard-water homes'),('Works with','Tyent water ionizers'),('Installation','By the Tyent India team')])],
 specs_note='Detailed specifications to be confirmed by Tyent India.',
 story=[('Do I need one?','Book a free water test. If your water is outside the recommended range, our team will advise a scale remover or pre-filter before installation.')],
 faq=[('Do I need a scale remover?','Only if your water is hard. A free water test tells you.'),('What is the price?','Price on request. Our team confirms it with your order.')],
 related=['filters','tm-x-soap','nmp-7'])
P['scale-remover'] = P.pop('scale')

P['tm-x-soap'] = dict(slug='tm-x-soap', key='soap', name='TM-X Beauty Soap', name_html='TM-X <em>Beauty Soap</em>', series='Filters & accessories', family='care',
 kicker='Fermented pomegranate & herbal enzymes', tags=['80 g','Skin care'], sub='Fermentation beauty soap',
 intro='A fermentation soap made with TM fermented pomegranate, honey, olive oil, hyaluronic acid and herbal enzymes. Rich, fine bubbles cleanse pores while a skin barrier keeps moisture in.',
 price=999, img='soap', gal=[('soap','TM-X fermentation beauty soap',0),('life-acidic','Pairs with acidic beauty water',0)],
 stats=[('80','','grams'),('6','','key ingredients'),('4','','special functions'),('0','','harsh scrubbing needed')],
 ingredients=[('TM fermented pomegranate','Vitamins C, B1, B2, E · anthocyanin, polyphenol','Rich antioxidants, strengthens the skin barrier'),
              ('Honey','Amino acids','Skin nutrition, regeneration, antibacterial'),
              ('Pinus sylvestris bud extract','','Inhibits collagenase, relieves skin trouble, antibacterial'),
              ('Olive oil','Oleic & linoleic acid · vitamins A, E','Skin regeneration and moisture'),
              ('Hyaluronic acid','Moisturising factor','Improves skin elasticity'),
              ('TM fermented herbal enzyme','Spirodela polyrrhiza, houttuynia cordata, saururus chinensis','Naturally nano-sized vitamins, minerals and organic acids')],
 feats=[('drop','Pore cleansing','Abundant, fine bubbles clean deep into pores.'),
        ('shield','Keeps moisture in','Forms a skin barrier that holds moisture.'),
        ('leaf','Rich in vitamins and minerals','For healthy-looking skin.'),
        ('clean','Smooth exfoliation','Fermented organic acids exfoliate gently.')],
 specs=[('TM-X Beauty Soap',[('Weight','80 g'),('Contains','High-grade oil and natural glycerin'),('Care','Keep dry between uses: it softens easily with moisture')])],
 story=[('Better with Tyent water','Wash with TM-X, then rinse with Acidic 2 "beauty water" from your Tyent for a fresh finish.')],
 faq=[('How should I store it?','Keep it dry between uses. It is made with high-grade oil and natural glycerin, which soften with moisture.'),('What is the price?','The M.R.P. is ₹999.')],
 related=['filters','scale-remover','hybrid-h2'])

ORDER = ['ace-13','hybrid-h2','uce-9-plus','uce-11-plus','uce-13-plus','nmp-5','nmp-7','nmp-9','nmp-11','q-series','filters','scale-remover','tm-x-soap']

def rs(n):
    s = str(n); last = s[-3:]; rest = s[:-3]; parts = []
    while len(rest) > 2: parts.insert(0, rest[-2:]); rest = rest[:-2]
    if rest: parts.insert(0, rest)
    return '₹' + ','.join(parts + [last]) if parts else '₹' + last

# ---------------------------------------------------------------- renderer
def render(slug):
    p = P[slug]; name = p['name']; mach = p['family'] not in ('care',)
    # hero gallery
    g0 = p['gal'][0]
    thumbs = ''.join(f'<button type="button" aria-pressed="{"true" if i==0 else "false"}" data-src="{s}" data-cut="{c}" aria-label="{E(a)}"><img src="img/{s}.webp" alt="" loading="lazy"></button>' for i,(s,a,c) in enumerate(p['gal'])) if len(p['gal']) > 1 else ''
    fin = ''
    if p.get('fin'):
        fin = '<div class="pd-fin"><span class="pd-lab">Faucet finish</span><div class="sws" role="group" aria-label="Faucet finish">' + ''.join(f'<button class="sw" aria-pressed="{"true" if i==0 else "false"}" aria-label="{n}" data-n="{n}" data-src="{im}" style="background:{c}"></button>' for i,(n,c,im) in enumerate(p['fin'])) + f'<span class="fname">{p["fin"][0][0]}</span></div></div>'
    chips = ''.join(f'<span class="tagx{" blue" if i==0 else ""}">{E(t)}</span>' for i,t in enumerate(p['tags']))
    keyspecs = ''
    if mach and p.get('stats'):
        keyspecs = '<ul class="pd-keys">' + ''.join(f'<li><b>{sg}{v}</b><span>{E(l)}</span></li>' for v,sg,l in p['stats']) + '</ul>'
    trust = '<ul class="pd-trust"><li>' + icon('shield',18) + '<span><b>3 + 15 yr</b> warranty</span></li><li>' + icon('clean',18) + '<span><b>9 free</b> services</span></li><li>' + icon('drop',18) + '<span><b>Free</b> water test</span></li></ul>' if mach and p['family'] not in ('ace','q') else ''
    foot_note = '<p class="pd-star">*Depends on input water quality and flow rate. No chemicals, salts or artificial enhancers. Only Tyent\'s patented turbo technology reaches 11.5 and 2.5 pH naturally.</p>' if p.get('water') and p['family'] not in ('ace','q') else ''
    sibs = ''
    if p.get('compare'):
        sibs = '<div class="pd-sibs" role="group" aria-label="Other models in the series">' + ''.join(f'<a href="{s}.html"{" aria-current=\"page\"" if s==slug else ""}>{E(n)}</a>' for s,n,*_ in p['compare'][1]) + '</div>'
    hero = f'''<section class="pd-hero" aria-labelledby="pd-h">
  <div class="wrap pd-grid">
    <div class="pd-media">
      <div class="pd-stage{' photo' if not g0[2] else ''}" id="pdStage"><div class="pd-arch" aria-hidden="true"><span class="pd-ring"></span><span class="pd-ring b"></span></div><img class="pd-img{' cut' if g0[2] else ''}" id="pdImg" src="img/{g0[0]}.webp" alt="Tyent {E(name)}, {E(g0[1])}"><span class="pd-zoomhint" aria-hidden="true">{E(p['series'])}</span></div>
      {f'<div class="pd-thumbs">{thumbs}</div>' if thumbs else ''}
    </div>
    <div class="pd-info">
      <nav class="crumb" aria-label="Breadcrumb"><a href="./">Home</a><span>/</span><a href="products.html">Products</a><span>/</span><span>{E(name)}</span></nav>
      <div class="pd-tags">{chips}</div>
      <p class="pd-kicker">{E(p['kicker'])}</p>
      <h1 class="pd-name{' long' if len(name)>11 else ''}" id="pd-h">{p['name_html']}</h1>
      <p class="pd-sub">{E(p['sub'])}</p>
      {sibs}
      <p class="pd-intro">{E(p['intro'])}</p>
      {keyspecs}
      {fin}
      <div class="buy pd-buy" data-prod="{p['key']}"></div>
      {trust}
      {foot_note}
    </div>
  </div>
</section>'''
    out = [hero]
    # stats band
    if mach and p.get('stats') and p['family'] not in ('ace','q'):
        band = [('15','','','year warranty on the plates'),('45','','+','year plate lifespan'),('55','','+','SMPS PLUS power settings'),('8500','','','litres per filter, .01 micron')]
        out.append('<section class="pd-band" aria-label="Built to last"><div class="wrap"><div class="pd-nums">' + ''.join(
            f'<div><b><span data-to="{v}" data-fmt="1">{int(v):,}</span>{f"<i>{sf}</i>" if sf else ""}</b><span>{E(l)}</span></div>' for v,pf,sf,l in band) + '</div></div></section>')
    # features
    fe = p['feats']
    out.append(f'''<section class="pd-feats" aria-labelledby="pf-h"><div class="wrap">
  <div class="sec-head"><div><p class="eyebrow">{'Features' if mach else 'Why it matters'}</p><h2 id="pf-h">{'Unmatched specifications.' if mach else 'Made for your Tyent.'}</h2></div><p>{'Loud and clear: every part of the ' + E(name) + ' is engineered for cleaner, healthier water, every day.' if mach else E(p['intro'].split('. ')[0]) + '.'}</p></div>
  <div class="pd-fgrid">{''.join(f'<article class="pd-f{fspan(len(fe)) if k==len(fe)-1 else ""}"><span class="ic">{icon(i)}</span><h3>{E(t)}</h3><p>{E(d)}</p></article>' for k,(i,t,d) in enumerate(fe))}</div>
</div></section>''')
    # plates
    if p.get('plates') and p['family'] in ('nmp','uce','ace'):
        n = p['plates']
        out.append(f'''<section class="pd-plates" aria-labelledby="pp-h" style="padding-top:0"><div class="wrap two">
  <div class="p3d-wrap light"><div class="p3d" data-auto="1" data-n="{n}" data-state="0" role="img" aria-label="{n} platinum-coated titanium plates inside the {E(name)} water cell"></div><div class="p3d-cap">{n} plates, dipped in platinum</div></div>
  <div><p class="eyebrow">Inside the water cell</p><h2 class="h2" id="pp-h">{n} plates. Made in Japan.</h2>
  <p class="body">Solid hybrid mesh electrodes from Permelec, Japan: titanium, coated in 99.9% pure platinum. Every plate adds 52.9 square inches of surface for the water to pass.</p>
  <div class="pd-area"><div><b>52.9</b><span>sq in per plate</span></div><i>×</i><div><b>{n}</b><span>plates</span></div><i>=</i><div class="tot"><b>{52.9*n:.1f}</b><span>sq in of plate surface</span></div></div>
  <ul class="list"><li><span><b>15-year warranty</b> on the plates, and a lifespan of 45+ years.</span></li><li><span><b>No chemicals or salts</b>, even at 11.5 and 2.5 pH.</span></li><li><span><b>PAST cleaning</b> keeps scale off every plate.</span></li></ul></div>
</div></section>''')
    # hybrid cell
    if p.get('hybrid'):
        out.append('''<section class="pd-twin" aria-labelledby="pt-h" style="padding-top:0"><div class="wrap">
  <div class="pd-twin-card"><div class="pd-twin-copy"><p class="eyebrow">The specially developed hybrid water cell</p><h2 class="h2" id="pt-h">Two chambers. Two kinds of water.</h2>
  <p class="body">The H2-Hybrid has patented dual electrolysis chambers. The world's only black box edition with twin-cell technology, it gives the whole family unlimited access to the water each person needs.</p>
  <p class="pd-pat">PCT international patent application PCT/KR2017/011890 · Technology patent 10-2017-00903670</p></div>
  <div class="pd-chambers"><div class="ch a"><span class="n">01</span><h3>Ionizing chamber</h3><p>Controlled by the one-touch display. Seven hydrogen-rich waters from 11.5 to 2.5 pH.</p><div class="mini-spec"><i style="background:var(--ph0)"></i><i style="background:var(--ph3)"></i><i style="background:var(--ph7)"></i><i style="background:var(--ph9)"></i><i style="background:var(--ph12)"></i></div></div>
  <div class="ch b"><span class="n">02</span><h3>PEM hydrogen chamber</h3><p>Operated by the jog dial. A Proton Exchange Membrane makes selective antioxidant hydrogen water at a neutral pH, without alkalinity.</p><div class="bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></div>
</div></section>''')
    # water types
    if p.get('water'):
        btns = ''.join(f'<button type="button" role="tab" aria-selected="{"true" if k=="alk2" else "false"}" data-ph="{num}" data-use="{E(u)}" data-l="{E(l)}" data-v="{v}" style="--c:{WC[k]}"><b>{v}</b><span>{E(l)}</span></button>' for k,l,v,num,u in WATER)
        out.append(f'''<section class="pd-water" aria-labelledby="pw-h"><div class="wrap">
  <div class="pd-water-card" id="pdWater" style="--wph:9">
    <div class="pd-wcopy"><p class="eyebrow">Discover Tyent's 7 water types</p><h2 id="pw-h">One machine. <em>Seven waters.</em></h2><p>A continuous stream of seven waters, from strong alkaline 11.5 pH to strong acidic 2.5 pH, for every need in your family.</p>
      <div class="pd-wnow" aria-live="polite"><span class="pd-wph" id="pdWph">9.0</span><span><b id="pdWl">Alkaline 2</b><small id="pdWu">Moderate drinking water. A step up from your first weeks.</small></span></div>
      <a class="pd-wlink" href="why-water-ionizer.html#ph">How to use each water →</a></div>
    <div class="pd-wglass" aria-hidden="true"><div class="pd-wfill"><div class="pd-wwave"></div></div><span class="pd-wtick"></span></div>
    <div class="pd-wlist" role="tablist" aria-label="Water types">{btns}</div>
  </div>
</div></section>''')
    # display overview
    if p.get('display'):
        num = 0; cols = ''
        for grp, items in DISPLAY:
            li = ''
            for it in items:
                num += 1; li += f'<li><span>{num}</span>{E(it)}</li>'
            cols += f'<div><h3>{grp}</h3><ol>{li}</ol></div>'
        lcd = '<div class="pd-lcd" aria-hidden="true"><div class="lcd-top"><span>12:33</span><span class="ph">9.0<small>pH</small></span><span>F1 50% · F2 50%</span></div><div class="lcd-grid">' + ''.join(f'<i style="--c:var({c})">{t}</i>' for t,c in [('1 ALK','--ph9'),('2 ALK','--ph9'),('3 ALK','--ph12'),('H₂O','--ph7'),('QTY.C','--muted'),('TURBO','--ph12'),('1 ACD','--ph3'),('2 ACD','--ph3'),('3 ACD','--ph0')]) + '</div></div>'
        title = 'Touchscreen operation.' if p['family'] == 'uce' else 'LCD display and touch pad.'
        out.append(f'''<section class="pd-disp" aria-labelledby="pd2-h" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><p class="eyebrow">The display, explained</p><h2 id="pd2-h">{title}</h2></div><p>Twenty things your {E(name)} shows you, from the water you are pouring to the moment a filter needs changing.</p></div>
  <div class="pd-disp-grid">{lcd}<div class="pd-dcols">{cols}</div></div>
</div></section>''')
    # safety (UCE)
    if p.get('safety'):
        out.append('<section class="pd-safe" aria-labelledby="ps-h" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">Smart safety diagnosis</p><h2 id="ps-h">Looks after itself.</h2></div><p>Under the sink and out of sight, so the UCE watches for problems on its own.</p></div><div class="pd-safe-grid">' +
          ''.join(f'<div><span class="n">0{i+1}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>' for i,(t,d) in enumerate(p['safety'])) + '</div></div></section>')
    # soap ingredients
    if p.get('ingredients'):
        out.append('<section class="pd-ingr" aria-labelledby="pi-h" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">Key ingredients</p><h2 id="pi-h">Fermented for your skin.</h2></div><p>Six ingredients chosen for antioxidants, moisture and gentle exfoliation.</p></div><div class="pd-ingr-grid">' +
          ''.join(f'<article><h3>{E(a)}</h3>{f"<small>{E(b)}</small>" if b else ""}<p>{E(c)}</p></article>' for a,b,c in p['ingredients']) + '</div></div></section>')
    # specs
    groups = ''
    for gi,(g, rows) in enumerate(p['specs']):
        rr = ''.join(f'<div class="r"><dt>{E(k)}</dt><dd>{E(v if v is not None else "Tyent " + name)}</dd></div>' for k,v in rows)
        groups += f'<div class="pd-sg"{" data-more" if gi>1 else ""}><h3>{E(g)}</h3><dl>{rr}</dl></div>'
    total = sum(len(r) for _,r in p['specs'])
    more = f'<button type="button" class="btn btn-g pd-more" aria-expanded="false">Show all {total} specifications</button>' if len(p['specs']) > 2 else ''
    note = f'<p class="pd-star">{E(p["specs_note"])}</p>' if p.get('specs_note') else ('<p class="pd-star">*Depends on input water quality and flow rate.</p>' if mach else '')
    out.append(f'''<section class="pd-specs" id="specs" aria-labelledby="pspec-h" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><p class="eyebrow">Specifications</p><h2 id="pspec-h">{E(name)}, in full.</h2></div><p>Everything in one place, from plate surface to service visits.</p></div>
  <div class="pd-spec{' open' if len(p['specs'])<=2 else ''}{' one' if len(p['specs'])==1 else ''}" id="pdSpec">{groups}</div>{more}{note}
</div></section>''')
    # filters strip for machines
    if mach and p['family'] not in ('ace','q'):
        out.append('''<section class="pd-filt" aria-labelledby="pfi-h" style="padding-top:0"><div class="wrap"><div class="pd-filt-card">
  <img src="img/filters.webp" alt="Tyent stage 1 and stage 2 filters" loading="lazy" width="447" height="905">
  <div><p class="eyebrow">Unmatched purity</p><h2 class="h2" id="pfi-h">.01 micron filters.</h2><p class="body">Tyent filters are NSF, EPA and ANSI certified. The Extreme .01 micron filters remove even the toughest contaminants, such as arsenic and chromium VI, along with heavy metals, pharmaceuticals, micro-organisms, bacteria, viruses, algae and fungi.</p>
  <div class="pd-filt-row"><span><b>8,500 L</b> per filter</span><span><b>2</b> stages</span><span><b>NSF · EPA · ANSI</b></span></div><a class="btn btn-g" href="filters.html">Replacement filters →</a></div>
</div></div></section>''')
    # compare within series
    if p.get('compare'):
        fam, line = p['compare']
        head = '<tr><th scope="col">Model</th><th scope="col">Plates</th><th scope="col">ORP, up to*</th><th scope="col">Hydrogen, up to*</th><th scope="col">Plate surface</th><th scope="col">Best for</th><th scope="col">M.R.P.</th></tr>'
        body = ''.join(f'<tr class="{"hl cur" if s==slug else ""}"><th scope="row"><a href="{s}.html">{E(n)}</a>{" <span class=\"you\">This model</span>" if s==slug else ""}</th><td><span class="pd-dots">{"".join("<i></i>" for _ in range(pl))}</span>{pl}</td><td>−{o} mV</td><td>{h:,} ppb</td><td>{52.9*pl:.1f} sq in</td><td>{E(bf)}</td><td><b>{rs(pr)}</b></td></tr>' for s,n,pl,o,h,pr,bf in line)
        out.append(f'''<section class="pd-cmp" aria-labelledby="pc-h" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><p class="eyebrow">Compare the {E(p['series'])}</p><h2 id="pc-h">Find your size.</h2></div><p>Same Tyent technology across the series. More plates give a higher ORP, more hydrogen and more water for a bigger family.</p></div>
  <div class="tbl-wrap rv-auto"><table class="tbl pd-tbl"><thead>{head}</thead><tbody>{body}</tbody></table></div>
</div></section>''')
    # story
    if p.get('story'):
        items = ''.join(f'<article><span class="n">{i+1:02d}</span><h3>{E(h)}</h3><p>{E(t)}</p></article>' for i,(h,t) in enumerate(p['story']))
        out.append(f'''<section class="pd-story" aria-labelledby="pst-h" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><p class="eyebrow">About the {E(name)}</p><h2 id="pst-h">Everything you should know.</h2></div><p>{E(p['sub'])}, explained in plain words.</p></div>
  <div class="pd-story-grid">{items}</div>
</div></section>''')
    # faq
    if p.get('faq'):
        acc = ''.join(f'<div><button aria-expanded="false" aria-controls="q{i}">{E(q)}</button><div class="a" id="q{i}" hidden>{E(a)}</div></div>' for i,(q,a) in enumerate(p['faq']))
        out.append(f'<section class="pd-faq" aria-labelledby="pq-h" style="padding-top:0"><div class="wrap two" style="align-items:start"><div><p class="eyebrow">FAQs</p><h2 class="h2" id="pq-h">Questions about the {E(name)}.</h2><p class="body">Something else? Call to order and our team will answer before you buy.</p></div><div class="acc">{acc}</div></div></section>')
    # related
    rel = ''.join(rcard(s) for s in p['related'] if s in P)
    out.append(f'<section class="pd-rel" aria-labelledby="pr-h" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">Keep exploring</p><h2 id="pr-h">You may also like.</h2></div><p><a class="lnk" href="products.html">Compare every Tyent →</a></p></div><div class="pd-rel-grid">{rel}</div></div></section>')
    # sticky bar
    out.append(f'<div class="pd-bar" id="pdBar" aria-hidden="true"><img src="img/{p["img"]}.webp" alt=""><span class="t"><b>{E(name)}</b><small>{rs(p["price"]) if p["price"] else "Price on request"}</small></span><button type="button" class="btn btn-g pd-bar-call" tabindex="-1">Call</button><button type="button" class="btn btn-p pd-bar-add" tabindex="-1">Add to basket</button></div>')
    return '\n'.join(out)

def fspan(n):
    r = (n + 1) % 3
    return ' w3' if r == 1 else (' w2' if r == 2 else '')

def rcard(s):
    q = P[s]
    pr = rs(q['price']) if q['price'] else 'Price on request'
    return f'<a class="pd-rc" href="{s}.html"><span class="im"><img src="img/{q["img"]}.webp" alt="" loading="lazy"></span><span class="tx"><small>{E(q["series"])}</small><b>{E(q["name"])}</b><span>{E(q["kicker"])}</span><em>{pr}</em></span><span class="go" aria-hidden="true">→</span></a>'
