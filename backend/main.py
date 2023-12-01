import os
import cv2
import base64
import numpy as np
from enum import Enum
from typing import List, Dict, Any, Union
from fastapi import FastAPI, File, Query, UploadFile, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from utils.basic import negative, thresholding, logarithmic, exponential, histogram_equalization
from utils.filters import average_filter, median_filter, weighted_averaging
from utils.operators import roberts, sobels, prewitt, laplacian, canny, otsu_threshold
from utils.binarys import closing_image, opening_image, erosion_image, dilation_image


load_dotenv()

app = FastAPI(title='API image processing',
              description="""<h2>API image processing</h2>""",
              version='0.1.0',
              contact={
                  "name": os.getenv('CONTACT_NAME'),
                  "url": os.getenv('CONTACT_URL'),
                  "email": os.getenv('CONTACT_EMAIL'),
              },
              debug=os.getenv('DEBUG', 'False') == 'True'
              )

origins = os.getenv('CORS_ALLOWED_ORIGINS', None).split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProcessingMode(str, Enum):
    negative = 'negative'
    thresholding = 'thresholding'
    logarithmic = 'logarithmic'
    exponential = 'exponential'
    histogram_equalization = 'histogram_equalization'
    average_filter = 'average_filter'
    weighted_averaging = 'weighted_averaging'
    median_filter = 'median_filter'
    roberts = 'roberts'
    sobels = 'sobels'
    prewitt = 'prewitt'
    laplacian = 'laplacian'
    canny = 'canny'
    otsu_threshold = 'otsu_threshold'
    erosion_image = 'erosion_image'
    dilation_image = 'dilation_image'
    closing_image = 'closing_image'
    opening_image = 'opening_image'


processing_functions = {
    ProcessingMode.negative: {'function': negative, 'parameters': []},
    ProcessingMode.thresholding: {'function': thresholding, 'parameters': ['threshold']},
    ProcessingMode.logarithmic: {'function': logarithmic, 'parameters': ['threshold']},
    ProcessingMode.exponential: {'function': exponential, 'parameters': ['gamma']},
    ProcessingMode.histogram_equalization: {'function': histogram_equalization, 'parameters': []},
    ProcessingMode.average_filter: {'function': average_filter, 'parameters': []},
    ProcessingMode.weighted_averaging: {'function': weighted_averaging, 'parameters': []},
    ProcessingMode.median_filter: {'function': median_filter, 'parameters': ['ksize']},
    ProcessingMode.roberts: {'function': roberts, 'parameters': ['scale']},
    ProcessingMode.sobels: {'function': sobels, 'parameters': []},
    ProcessingMode.prewitt: {'function': prewitt, 'parameters': []},
    ProcessingMode.laplacian: {'function': laplacian, 'parameters': []},
    ProcessingMode.canny: {'function': canny, 'parameters': []},
    ProcessingMode.otsu_threshold: {'function': otsu_threshold, 'parameters': []},
    ProcessingMode.erosion_image: {'function': erosion_image, 'parameters': ['ksize']},
    ProcessingMode.dilation_image: {'function': dilation_image, 'parameters': ['ksize']},
    ProcessingMode.closing_image: {'function': closing_image, 'parameters': ['ksize', 'threshold']},
    ProcessingMode.opening_image: {'function': opening_image, 'parameters': ['ksize', 'threshold']},
}


def process_image_array(image_array, mode: ProcessingMode, parameters: Dict[str, Any] = {}):
    processing_function_data = processing_functions[mode]
    function = processing_function_data["function"]
    required_parameters = processing_function_data["parameters"]
    function_parameters = {
        param: parameters[param] for param in required_parameters if param in parameters}
    processed_image = function(image_array, **function_parameters)
    return processed_image


@app.get('/', include_in_schema=False)
async def root():
    return RedirectResponse(url='/docs')


@app.get('/social_network/', include_in_schema=False)
async def social_network():
    return JSONResponse(
        content={
            'facebook_url': os.getenv('FACEBOOK_URL'),
            'website_url': os.getenv('WEBSITE_URL'),
            'github_url': os.getenv('GITHUB_URL'),
        },
        status_code=200
    )


@app.get("/processing_functions/", response_model=Dict[ProcessingMode, Dict[str, Union[str, List[str]]]])
async def get_processing_functions():
    processing_functions_names = {}
    for mode, data in processing_functions.items():
        processing_functions_names[mode] = {
            'function': data['function'].__name__,
            'parameters': data['parameters']
        }
    return processing_functions_names


@app.post("/api/")
async def process_image(
    file: UploadFile = File(...),
    mode: ProcessingMode = Query(...),
    threshold: int = Query(None),
    scale: float = Query(None),
    gamma: int = Query(None),
    ksize: int = Query(None),
):
    try:
        image_data = await file.read()
        image_array = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_GRAYSCALE)
        parameters = {
            'threshold': threshold,
            'scale': scale,
            'gamma': gamma,
            'ksize': ksize,
        }
        result = process_image_array(image, mode, parameters)
        _, buffer = cv2.imencode('.webp', result)
        byte_data = buffer.tobytes()

        base64_image = base64.b64encode(byte_data).decode('utf-8')
        return JSONResponse(
            content={"image": base64_image},
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
