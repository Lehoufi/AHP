import Link from "next/link";
export default function Land() {
    return (
        <div className="min-h-[90vh] bg-gray-50">
            <section className="relative pb-20 bg-[#007BFF] text-white">
                <div className="container mx-auto flex flex-col items-center lg:flex-row lg:items-center">
                    {/* Left Side: Text Content */}
                    <div className="lg:w-1/2 flex justify-center items-center text-start">
                    <div className="w-[77%] text-start">
                            <h2 className="text-4xl lg:text-5xl font-bold">
                            Simplify your choices, trust the results
                        </h2>
                        <p className="mt-4 text-lg">
                            We take the complexity out of decision-making by providing tools 
                            that help you evaluate and rank options with confidence.
                        </p>
                        <div className="mt-6 flex flex-col lg:flex-row gap-4 justify-center">
                        <Link href='/#mcda' className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100">
                                Learn More
                            </Link>
                            <Link href='/ahp' className="bg-transparent border border-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-opacity-90">
                                Start Now
                            </Link>
                        </div>
                            </div>
                      
                    </div>

                    {/* Right Side: SVG Image */}
                    <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
                        <img 
                            src="/hero.svg" 
                            alt="Hero Illustration" 
                            className="w-3/4 lg:w-5/6 max-w-3xl"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
