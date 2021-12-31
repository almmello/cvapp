import os
import json
from selenium import webdriver

from selenium.webdriver.common.keys import Keys

from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


actual_dir = os.path.dirname(__file__)
download_dir = "project/static/pdf"
html_file = "project/build/index.html"
download_dir2 = os.path.join(actual_dir, download_dir)
open_file = os.path.join(actual_dir, html_file)
open_par = "file:" + open_file
chrome_options = Options()

print("Debug")
print(open_par)

settings = {
    "recentDestinations": [{
        "id": "Save as PDF",
        "origin": "local",
        "account": ""
    }],
    "selectedDestinationId": "Save as PDF",
    "version": 2,
    "isHeaderFooterEnabled": False,

    "customMargins": "1cm, 0cm, 1cm, 0cm",
    #"marginsType": 2,
    "scaling": 70,
    "scalingType": 3,
    "scalingTypePdf": 3,
    #"isLandscapeEnabled":True,#Landscape horizontal, portrait portrait, if this parameter is not set, the default portrait
    "isCssBackgroundEnabled": True,
    "mediaSize": {
        "height_microns": 297000,
        "name": "ISO_A4",
        "width_microns": 210000,
        "custom_display_name": "A4 210 x 297 mm"
    },
}

chrome_options.add_argument('--enable-print-browser')
#chrome_options.add_argument ('--headless') #headless mode, the browser window is invisible, can improve efficiency

prefs = {
    "printing.print_preview_sticky_settings.appState": json.dumps(settings),
    "savefile.default_directory": download_dir2
}
chrome_options.add_experimental_option('prefs', prefs)
chrome_options.add_argument('--kiosk-printing') #Silent printing, no user can click the OK button for the print page

#options.add_argument("start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
#driver.get(open_par)
driver.get("http://127.0.0.1:5000/")
#driver.maximize_window()
# time.sleep(7)
driver.execute_script('window.print();')
#driver.quit()
driver.close()


