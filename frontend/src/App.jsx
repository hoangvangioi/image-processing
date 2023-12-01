import React, { useState, useCallback, useEffect } from 'react';
import {
	Navbar,
	IconButton,
	Typography,
	Checkbox,
} from "@material-tailwind/react";
import axios from 'axios';


const App = () => {
	const [selectedFile, setSelectedFile] = useState();
	const [selectedImage, setSelectedImage] = useState();
	const [processedImage, setProcessedImage] = useState();
	const [selectedMode, setSelectedMode] = useState('negative');
	const [threshold, setThreshold] = useState(127);
	const [scale, setScale] = useState(1.0);
	const [gamma, setGamma] = useState(3);
	const [ksize, setKsize] = useState(3);
	const [processingFunctions, setProcessingFunctions] = useState('negative');
	const [socialNetwork, setSocialNetwork] = useState();
	
	const [autoProcess, setAutoProcess] = useState(false);

	const onImageChange = useCallback((event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		setSelectedImage(URL.createObjectURL(file));
	}, []);

	const handleModeChange = useCallback((event) => {
		setSelectedMode(event.target.value);
		resetParameters();
	}, []);

	const handleAutoProcessChange = useCallback(() => {
		setAutoProcess(!autoProcess);
	}, [autoProcess]);

	const submitImage = useCallback(async () => {
		if (!selectedFile) {
			alert('Please select a file before submitting.');
			return;
		}

		const formData = new FormData();
		formData.append('file', selectedFile);

		const params = {
			mode: selectedMode,
			threshold: selectedMode === 'thresholding' || selectedMode === 'logarithmic' || selectedMode === 'closing_image' || selectedMode === 'opening_image' ? threshold : undefined,
			scale: selectedMode === 'roberts' ? scale : undefined,
			gamma: selectedMode === 'exponential' ? gamma : undefined,
			ksize: selectedMode === 'median_filter' || selectedMode === 'erosion_image' || selectedMode === 'dilation_image' || selectedMode === 'closing_image' || selectedMode === 'opening_image' ? ksize : undefined,
		};

		try {
			const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/`, formData, { params });

			setProcessedImage(`data:image/webp;base64,${result.data.image}`);
		} catch (error) {
			console.error('Error submitting image:', error);
		}
	}, [selectedFile, selectedMode, threshold, scale, gamma, ksize]);

	useEffect(() => {
		if (autoProcess) {
			submitImage();
		}
	}, [autoProcess, submitImage]);

	const resetParameters = () => {
		setThreshold(127);
		setScale(1.0);
		setGamma(3);
		setKsize(3);
		setProcessedImage(null);
	};

	useEffect(() => {
		
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/processing_functions/`)
            .then(response => {
                setProcessingFunctions(Object.keys(response.data));
            })
            .catch(error => console.error('Error fetching processing functions:', error));
    }, []);

	useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/social_network/`)
            .then(response => {
                setSocialNetwork(response.data);
            })
            .catch(error => console.error('Error fetching social network:', error));
    }, []);

	return (
		<div className="min-h-screen bg-blue-gray-50/50">
			<div className="container mx-auto">
				<div className="p-4">
					<Navbar className="rounded-xl transition-all" fullWidth >
						<div className="flex flex-row justify-between gap-6 md:items-center">
							<label>
								<span className="flex select-none items-center gap-3 cursor-pointer rounded-lg bg-gradient-to-tr from-pink-600 to-pink-400 py-3 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										aria-hidden="true"
										className="h-5 w-5 md:block hidden"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
										></path>
									</svg>
									Upload Files
								</span>
								<input type='file' onChange={onImageChange} hidden />
							</label>
							{socialNetwork && (
							<div className="flex items-center">
								<div className="flex gap-4">
									<a href={socialNetwork.github_url} title='Github' target="_blank" rel="noopener noreferrer">
										<IconButton title='Github' className="rounded bg-[#333333] hover:shadow-[#333333]/20 focus:shadow-[#333333]/20 active:shadow-[#333333]/10">
											<i className="fab fa-github text-xl" />
										</IconButton>
									</a>
									<a href={socialNetwork.facebook_url} title='Facebook' target="_blank" rel="noopener noreferrer">
										<IconButton title='Facebook' className="rounded bg-[#1DA1F2] hover:shadow-[#1DA1F2]/20 focus:shadow-[#1DA1F2]/20 active:shadow-[#1DA1F2]/10">
											<i className="fab fa-facebook text-xl" />
										</IconButton>
									</a>
									<a href={socialNetwork.website_url} title='Website' target="_blank" rel="noopener noreferrer">
										<IconButton title='Website' className="rounded bg-[#47d147] hover:shadow-[#47d147]/20 focus:shadow-[#47d147]/20 active:shadow-[#47d147]/10">
											<i className="fa-solid fa-square-rss text-xl" />
										</IconButton>
									</a>
								</div>
							</div>
							)}
						</div>
					</Navbar>
					{!selectedFile && (<Typography variant="h1" as='center' color="blue" className='mt-10' textGradient>Please select an image.</Typography>)}
					{selectedFile && (
						<div className="mt-12">
							<div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
								<div className="relative h-10 w-72 min-w-[200px]">
									<select value={selectedMode} onChange={handleModeChange} className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
										{processingFunctions.map((mode) => (
											<option key={mode} value={mode}>{mode.replace(/(^\w|_\w)/g, match => match.toUpperCase().replace("_", " "))}</option>
										))}
									</select>
									<label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
										Select mode
									</label>
								</div>
								<Checkbox
									label={
										<Typography color="blue-gray" className="flex font-medium">
											Auto Process
										</Typography>
									}
									checked={autoProcess}
									onChange={handleAutoProcessChange}
									color='pink'
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 w-3"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
												clipRule="evenodd"
											/>
										</svg>
									}
									className="hover:before:opacity-0"
								/>
								{(selectedMode === 'thresholding' || selectedMode === 'logarithmic' || selectedMode === 'closing_image' || selectedMode === 'opening_image') && (
									<div className="mx-2">
										<p className="block antialiased font-sans text-base leading-relaxed text-blue-gray-900 font-medium mb-1">Threshold: </p>
										<div className="relative w-full min-w-[200px] h-3 text-[#2ec947]">
											<label className="absolute inset-0 z-10 h-full pointer-events-none rounded-none bg-[#2ec946]" style={{width: `${threshold*(100/255)}%`}}></label>
												<input type="range" max={255} min={0} step={1}
												onChange={(e) => setThreshold(e.target.value)}
												className="w-full absolute inset-0 bg-transparent cursor-pointer focus:outline-none focus:outline-0 appearance-none [-webkit-appearance:none] [&amp;::-webkit-slider-runnable-track]:h-full [&amp;::-moz-range-track]:h-full [&amp;::-webkit-slider-runnable-track]:rounded-full [&amp;::-moz-range-track]:rounded-full [&amp;::-webkit-slider-runnable-track]:bg-transparent [&amp;::-moz-range-track]:bg-transparent rounded-none !bg-[#2ec946]/10 border border-[#2ec946]/20 [&amp;::-moz-range-thumb]:appearance-none [&amp;::-moz-range-thumb]:[-webkit-appearance:none] [&amp;::-webkit-slider-thumb]:appearance-none [&amp;::-webkit-slider-thumb]:[-webkit-appearance:none] [&amp;::-moz-range-thumb]:border-0 [&amp;::-webkit-slider-thumb]:border-0 [&amp;::-moz-range-thumb]:ring-2 [&amp;::-webkit-slider-thumb]:ring-2 [&amp;::-moz-range-thumb]:ring-current [&amp;::-webkit-slider-thumb]:ring-current [&amp;::-moz-range-thumb]:bg-white [&amp;::-webkit-slider-thumb]:bg-white [&amp;::-moz-range-thumb]:relative [&amp;::-webkit-slider-thumb]:relative [&amp;::-moz-range-thumb]:z-20 [&amp;::-webkit-slider-thumb]:z-20 [&amp;::-moz-range-thumb]:w-5 [&amp;::-webkit-slider-thumb]:w-5 [&amp;::-moz-range-thumb]:h-5 [&amp;::-webkit-slider-thumb]:h-5 [&amp;::-moz-range-thumb]:rounded-none [&amp;::-webkit-slider-thumb]:rounded-none [&amp;::-moz-range-thumb]:-mt-[4px] [&amp;::-webkit-slider-thumb]:-mt-[4px]"
												value={threshold} />
										</div>
									</div>
								)}
								{selectedMode === 'roberts' && (
									<div className="mx-2">
										<p className="block antialiased font-sans text-base leading-relaxed text-blue-gray-900 font-medium mb-1">Scale: </p>
										<div className="relative w-full min-w-[200px] h-3 text-[#6d28d9]">
											<label className="absolute inset-0 z-10 h-full pointer-events-none rounded-none bg-[#6d28d9]" style={{width: `${scale*10}%`}}></label>
												<input type="range" max={10} min={0} step={0.1}
												onChange={(e) => setScale(e.target.value)}
												className="w-full absolute inset-0 bg-transparent cursor-pointer focus:outline-none focus:outline-0 appearance-none [-webkit-appearance:none] [&amp;::-webkit-slider-runnable-track]:h-full [&amp;::-moz-range-track]:h-full [&amp;::-webkit-slider-runnable-track]:rounded-full [&amp;::-moz-range-track]:rounded-full [&amp;::-webkit-slider-runnable-track]:bg-transparent [&amp;::-moz-range-track]:bg-transparent rounded-none !bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 [&amp;::-moz-range-thumb]:appearance-none [&amp;::-moz-range-thumb]:[-webkit-appearance:none] [&amp;::-webkit-slider-thumb]:appearance-none [&amp;::-webkit-slider-thumb]:[-webkit-appearance:none] [&amp;::-moz-range-thumb]:border-0 [&amp;::-webkit-slider-thumb]:border-0 [&amp;::-moz-range-thumb]:ring-2 [&amp;::-webkit-slider-thumb]:ring-2 [&amp;::-moz-range-thumb]:ring-current [&amp;::-webkit-slider-thumb]:ring-current [&amp;::-moz-range-thumb]:bg-white [&amp;::-webkit-slider-thumb]:bg-white [&amp;::-moz-range-thumb]:relative [&amp;::-webkit-slider-thumb]:relative [&amp;::-moz-range-thumb]:z-20 [&amp;::-webkit-slider-thumb]:z-20 [&amp;::-moz-range-thumb]:w-5 [&amp;::-webkit-slider-thumb]:w-5 [&amp;::-moz-range-thumb]:h-5 [&amp;::-webkit-slider-thumb]:h-5 [&amp;::-moz-range-thumb]:rounded-none [&amp;::-webkit-slider-thumb]:rounded-none [&amp;::-moz-range-thumb]:-mt-[4px] [&amp;::-webkit-slider-thumb]:-mt-[4px]"
												value={scale} />
										</div>
									</div>
								)}
								{selectedMode === 'exponential' && (
									<div className="mx-2">
										<p className="block antialiased font-sans text-base leading-relaxed text-blue-gray-900 font-medium mb-1">Gamma: </p>
										<div className="relative w-full min-w-[200px] h-3 text-[#f97316]">
											<label className="absolute inset-0 z-10 h-full pointer-events-none rounded-none bg-[#f97316]" style={{width: `${gamma*10}%`}}></label>
												<input type="range" max={10} min={0} step={1}
												onChange={(e) => setGamma(e.target.value)}
												className="w-full absolute inset-0 bg-transparent cursor-pointer focus:outline-none focus:outline-0 appearance-none [-webkit-appearance:none] [&amp;::-webkit-slider-runnable-track]:h-full [&amp;::-moz-range-track]:h-full [&amp;::-webkit-slider-runnable-track]:rounded-full [&amp;::-moz-range-track]:rounded-full [&amp;::-webkit-slider-runnable-track]:bg-transparent [&amp;::-moz-range-track]:bg-transparent rounded-none !bg-[#fb923c]/10 border border-[#fb923c]/20 [&amp;::-moz-range-thumb]:appearance-none [&amp;::-moz-range-thumb]:[-webkit-appearance:none] [&amp;::-webkit-slider-thumb]:appearance-none [&amp;::-webkit-slider-thumb]:[-webkit-appearance:none] [&amp;::-moz-range-thumb]:border-0 [&amp;::-webkit-slider-thumb]:border-0 [&amp;::-moz-range-thumb]:ring-2 [&amp;::-webkit-slider-thumb]:ring-2 [&amp;::-moz-range-thumb]:ring-current [&amp;::-webkit-slider-thumb]:ring-current [&amp;::-moz-range-thumb]:bg-white [&amp;::-webkit-slider-thumb]:bg-white [&amp;::-moz-range-thumb]:relative [&amp;::-webkit-slider-thumb]:relative [&amp;::-moz-range-thumb]:z-20 [&amp;::-webkit-slider-thumb]:z-20 [&amp;::-moz-range-thumb]:w-5 [&amp;::-webkit-slider-thumb]:w-5 [&amp;::-moz-range-thumb]:h-5 [&amp;::-webkit-slider-thumb]:h-5 [&amp;::-moz-range-thumb]:rounded-none [&amp;::-webkit-slider-thumb]:rounded-none [&amp;::-moz-range-thumb]:-mt-[4px] [&amp;::-webkit-slider-thumb]:-mt-[4px]"
												value={gamma} />
										</div>
									</div>
								)}
								{(selectedMode === 'median_filter' || selectedMode === 'erosion_image' || selectedMode === 'dilation_image' || selectedMode === 'closing_image' || selectedMode === 'opening_image') && (
									<div className="mx-2">
										<p className="block antialiased font-sans text-base leading-relaxed text-blue-gray-900 font-medium mb-1">Kernel Size: </p>
										<div className="relative w-full min-w-[200px] h-3 text-[#dc2626]">
											<label className="absolute inset-0 z-10 h-full pointer-events-none rounded-none bg-[#dc2626]" style={{width: `${ksize*10}%`}}></label>
												<input type="range" max={10} min={0} step={1}
												onChange={(e) => setKsize(e.target.value)}
												className="w-full absolute inset-0 bg-transparent cursor-pointer focus:outline-none focus:outline-0 appearance-none [-webkit-appearance:none] [&amp;::-webkit-slider-runnable-track]:h-full [&amp;::-moz-range-track]:h-full [&amp;::-webkit-slider-runnable-track]:rounded-full [&amp;::-moz-range-track]:rounded-full [&amp;::-webkit-slider-runnable-track]:bg-transparent [&amp;::-moz-range-track]:bg-transparent rounded-none !bg-[#ef4444]/10 border border-[#ef4444]/20 [&amp;::-moz-range-thumb]:appearance-none [&amp;::-moz-range-thumb]:[-webkit-appearance:none] [&amp;::-webkit-slider-thumb]:appearance-none [&amp;::-webkit-slider-thumb]:[-webkit-appearance:none] [&amp;::-moz-range-thumb]:border-0 [&amp;::-webkit-slider-thumb]:border-0 [&amp;::-moz-range-thumb]:ring-2 [&amp;::-webkit-slider-thumb]:ring-2 [&amp;::-moz-range-thumb]:ring-current [&amp;::-webkit-slider-thumb]:ring-current [&amp;::-moz-range-thumb]:bg-white [&amp;::-webkit-slider-thumb]:bg-white [&amp;::-moz-range-thumb]:relative [&amp;::-webkit-slider-thumb]:relative [&amp;::-moz-range-thumb]:z-20 [&amp;::-webkit-slider-thumb]:z-20 [&amp;::-moz-range-thumb]:w-5 [&amp;::-webkit-slider-thumb]:w-5 [&amp;::-moz-range-thumb]:h-5 [&amp;::-webkit-slider-thumb]:h-5 [&amp;::-moz-range-thumb]:rounded-none [&amp;::-webkit-slider-thumb]:rounded-none [&amp;::-moz-range-thumb]:-mt-[4px] [&amp;::-webkit-slider-thumb]:-mt-[4px]"
												value={ksize} />
										</div>
									</div>
								)}
								{!autoProcess && <button onClick={submitImage} className='bg-blue-600 p-2 rounded m-2 text-white' >Xử lý ảnh</button>}
							</div>

							<div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
								{selectedImage && 
								<figure>
									<img className='h-96 w-full rounded-lg object-cover object-center' src={selectedImage} alt="Original" />
									<Typography as='title' variant='lead' className="mt-2 text-center font-normal">	Image Original </Typography>
								</figure>
								}
								{processedImage && 
								<figure>
									<img className='h-96 w-full rounded-lg object-cover object-center' src={processedImage} alt="Processed" />
									<Typography as='title' variant='lead' className="mt-2 text-center font-normal">	Image Processed </Typography>
								</figure>
								}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
