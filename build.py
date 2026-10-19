"""Builds the Tyent India site: shared head/header/footer + per-page content from src/."""
import os, re
D = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(D, 'src')

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,500;12..96,800&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">'

CHEV = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
IC = {
 'story':'<path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM8 7h6"/>',
 'india':'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 'values':'<path d="M12 21C7 17 3 13.5 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-4 8-9 12z"/>',
 'service':'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
}
def ic(n): return f'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">{IC[n]}</svg>'

ABOUT = [('about.html#story','Our Story','Thirty years of ionizer engineering','story'),
         ('about.html#india','Tyent India','The team that brings Tyent home','india'),
         ('about.html#values','Our Values','What we promise every family','values'),
         ('about.html#service','Service Network','Installation, filters and care','service')]
PRODUCTS = [('products.html#ace','ACE-13','13 plates · touchscreen','ace'),
            ('products.html#hybrid','H2-Hybrid','Ionizer + hydrogen water','hybrid'),
            ('products.html#uce','UCE-13 Plus','Under-counter · 4 finishes','uce-set2'),
            ('products.html#nmp','NMP Series','5 to 11 plates · classic','nmp9'),
            ('products.html#q','Q-Series','Eco mode · soft design','q'),
            ('products.html#care','Filters & Accessories','Filters, scale remover, soap','filters')]
FLAT = [('why-tyent.html','Why Tyent','why'),('why-water-ionizer.html','Why Water Ionizer','wwi'),
        ('certifications.html','Certifications','certs'),('blogs.html','Blogs','blogs'),('contact.html','Contact Us','contact')]

LOGO = '<img class="lb" src="img/logo-blue.webp" alt="Tyent India" width="600" height="219"><img class="lw" src="img/logo-white.webp" alt="Tyent India" width="600" height="219">'

def header(active):
    cur = lambda k: ' aria-current="page"' if k == active else ''
    about = ''.join(f'<a href="{h}"><span class="ic">{ic(i)}</span><span><b>{t}</b><small>{s}</small></span></a>' for h,t,s,i in ABOUT)
    prods = ''.join(f'<a href="{h}"><span class="thumb"><img src="img/{im}.webp" alt="" loading="lazy"></span><span><b>{t}</b><small>{s}</small></span></a>' for h,t,s,im in PRODUCTS)
    flat = ''.join(f'<a href="{h}"{cur(k)}>{t}</a>' for h,t,k in FLAT)
    dr_flat = ''.join(f'<a href="{h}"{cur(k)}>{t}</a>' for h,t,k in FLAT)
    return f'''<div id="glow" aria-hidden="true"></div>
<header id="hdr">
  <div class="wrap nav">
    <a class="logo" href="./" aria-label="Tyent India home">{LOGO}</a>
    <nav class="links" aria-label="Primary">
      <a href="./"{cur('home')}>Home</a>
      <div class="dd"><button class="dd-btn{' cur' if active=='about' else ''}" aria-expanded="false" aria-haspopup="true">About Us {CHEV}</button><div class="dd-panel">{about}</div></div>
      <div class="dd mega"><button class="dd-btn{' cur' if active=='products' else ''}" aria-expanded="false" aria-haspopup="true">Products {CHEV}</button><div class="dd-panel mega-panel">{prods}<a class="all" href="products.html">Compare all ionizers <span>→</span></a></div></div>
      {flat}
    </nav>
    <div class="nav-r">
      <button class="icon-btn" id="theme" aria-label="Switch to dark theme"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/></svg></button>
      <a class="btn btn-p mag" href="contact.html#enquire">Book a demo <span class="arr">→</span></a>
      <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" hidden>
  <div class="dr-panel" role="dialog" aria-label="Menu">
    <div class="dr-top"><a class="logo" href="./">{LOGO}</a><button class="icon-btn dr-close" aria-label="Close menu">✕</button></div>
    <a href="./"{cur('home')}>Home</a>
    <div class="dr-group"><span>About Us</span><div>{''.join(f'<a href="{h}">{t}</a>' for h,t,s,i in ABOUT)}</div></div>
    <div class="dr-group"><span>Products</span><div>{''.join(f'<a href="{h}">{t}</a>' for h,t,s,i in PRODUCTS)}</div></div>
    {dr_flat}
    <a class="btn btn-p" href="contact.html#enquire">Book a free home demo <span class="arr">→</span></a>
  </div>
</div>'''

FOOTER = f'''<footer>
  <canvas class="fwave" aria-hidden="true"></canvas>
  <div class="wrap">
    <div class="foot">
      <div><a class="logo" href="./">{LOGO}</a><p class="tag-line">Better water.<br>A healthier tomorrow.</p><p style="margin-top:14px;max-width:34ch;font-size:.92rem;color:rgba(201,215,230,.7)">Water ionizers for Indian homes, with installation and service nationwide.</p></div>
      <div><h4>Quick links</h4><ul><li><a href="./">Home</a></li><li><a href="about.html">About Us</a></li><li><a href="why-tyent.html">Why Tyent</a></li><li><a href="why-water-ionizer.html">Why Water Ionizer</a></li><li><a href="certifications.html">Certifications</a></li><li><a href="blogs.html">Blogs</a></li></ul></div>
      <div><h4>Products</h4><ul>{''.join(f'<li><a href="{h}">{t}</a></li>' for h,t,s,i in PRODUCTS)}</ul></div>
      <div class="fc"><h4>Contact us</h4><ul><li><span class="todo">Phone number to be added</span></li><li><span class="todo">Email to be added</span></li><li><span class="todo">Office address to be added</span></li><li><a href="contact.html#enquire">Book a free demo →</a></li></ul></div>
    </div>
    <div class="giant" aria-hidden="true">tyent</div>
    <div class="legal"><span>Redesign concept for tyent.co.in</span><span>Specifications and certifications to be confirmed by Tyent India before launch.</span></div>
  </div>
</footer>'''

BAND = '''<section style="padding-top:0"><div class="wrap"><div class="band">
  <div><h2>Taste it in your own kitchen first.</h2><p>Book a free home demonstration. A Tyent specialist will test your water and show you every setting.</p></div>
  <a class="btn mag" href="contact.html#enquire">Book a free home demo →</a>
</div></div></section>'''

def page(name, title, active, main, script='', full_doc=True, band=True):
    body = header(active) + '\n<main id="top">\n' + main + ('\n' + BAND if band else '') + '\n</main>\n' + FOOTER + '\n' + (f'<script>\n{script}\n</script>\n' if script else '') + '<script src="site.js"></script>\n'
    headbits = f'<title>{title}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n{FONTS}\n<link rel="stylesheet" href="styles.css">\n'
    if full_doc:
        html = f'<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n{headbits}<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}[hidden]{{display:none!important}}</style>\n</head>\n<body>\n{body}</body>\n</html>\n'
    else:
        html = headbits + body
    open(os.path.join(D, name), 'w').write(html)
    print('built', name, len(html)//1024, 'KB')

def src(n):
    p = os.path.join(SRC, n)
    return open(p).read() if os.path.exists(p) else ''

if __name__ == '__main__':
    # home is the artifact's main page (wrapped by the host); the rest are standalone documents
    import sys
    # default: a normal static site. `python build.py --artifact` writes index.html as a fragment for the Claude artifact host.
    art = '--artifact' in sys.argv
    page('index.html', 'Tyent India', 'home', src('home.main.html'), src('home.js'), full_doc=not art, band=False)
    for fn, title, key in [('about.html','About Tyent India','about'),('products.html','Tyent Ionizers','products'),
                           ('why-tyent.html','Why Tyent','why'),('why-water-ionizer.html','Why Water Ionizer','wwi'),
                           ('certifications.html','Tyent Certifications','certs'),('blogs.html','Tyent Blog','blogs'),
                           ('contact.html','Contact Tyent India','contact')]:
        base = fn[:-5]
        page(fn, title, key, src(base + '.main.html'), src(base + '.js'), band=(key != 'contact'))
