import java.awt.image.BufferedImage;
import java.awt.image.Raster;
import java.awt.image.WritableRaster;
import java.io.*;
import java.util.Arrays;

import javax.imageio.ImageIO;


public class Image {
	static {
		System.loadLibrary("ImageDLL");
	}

	public static native void inverting(int width, int height, int[] pixels);
	public static native void filtering(int width, int height, int[] filter, int[] pixelsIn, int[] pixelsOut);

	static void inverting(String fileName) {
		System.out.println("Inverting");
		try {
			BufferedImage image = ImageIO.read(new File(fileName));
			final int width =  image.getWidth();
			final int height = image.getHeight();

			System.out.println("Image Size = (" + width + " x " + height + "), Type = " + image.getType());
			
			// invert image
			for(int v = 0; v < height; v++) {
				for(int u = 0; u < width; u++) {
					int pixel = image.getRGB(u, v);
					// invert pixel
					image.setRGB(u, v, ~pixel);
				}
			}
			
			ImageIO.write(image, "jpeg", new File("Matterhorn-inv.jpg"));
			
			Raster inRaster = image.getData();
			int[] pixels = new int[width*height*inRaster.getNumBands()];
			int[] pixels2 = new int[pixels.length];

			inRaster.getPixels(0, 0, width, height, pixels);
			System.arraycopy(pixels, 0, pixels2, 0, pixels.length);
			
			// invert in Java already inverted image
			for(int i = 0; i < pixels.length; i++) {
				pixels[i] = ~pixels[i];
			}

			// invert in C++ already inverted image
			inverting(width, height, pixels2);

			// compare results
			if (Arrays.equals(pixels, pixels2)) {
				System.out.println("Results are identical");

				WritableRaster outRaster = inRaster.createCompatibleWritableRaster();

				// store and save new image
				outRaster.setPixels(0, 0, width, height, pixels);
				image.setData(outRaster);
				ImageIO.write(image, "jpeg", new File("Invert-" + fileName));
			} else {
				System.out.println("Results are different");

				WritableRaster outRaster = inRaster.createCompatibleWritableRaster();
				
				// store and save new image
				outRaster.setPixels(0, 0, width, height, pixels);
				image.setData(outRaster);
				ImageIO.write(image, "jpeg", new File("Java-Invert-" + fileName));

				// store and save new image
				outRaster.setPixels(0, 0, width, height, pixels);
				image.setData(outRaster);
				ImageIO.write(image, "jpeg", new File("C++-Invert-" + fileName));
			}
		} catch(IOException e) {
			e.printStackTrace();
		}
	}
	
	static int getFilterCoeff(int[] filter, int fSize, int i, int j) {
		return filter[j*fSize + i];
	}
	
	// get RGB at image position (u,v)
	static void getRGB(int[] pixels, int width, int u, int v, int[] rgb) {
		assert rgb.length == 3;
		final int idx = 3*(v*width + u);
		
		rgb[0] = pixels[idx + 2];
		rgb[1] = pixels[idx + 1];
		rgb[2] = pixels[idx + 0];
	}
	
	// set RGB at image position (u,v)
	static void setRGB(int[] pixels, int width, int u, int v, int[] rgb) {
		assert rgb.length == 3;
		final int idx = 3*(v*width + u);

		pixels[idx + 2] = rgb[0];
		pixels[idx + 1] = rgb[1];
		pixels[idx + 0] = rgb[2];
	}
	
	// clamp input to 8 bit range [0,255]
	static int clamp(int v) {
		return (v == (v & 0xFF)) ? v : (v < 0) ? 0 : 255;
	}
	
	static void filtering(String fileName) {
		System.out.println("Filtering");
		try {
			BufferedImage image = ImageIO.read(new File(fileName));
			final int width =  image.getWidth();
			final int height = image.getHeight();
			final int[] filter = {
					 0, 0,-1, 0, 0, 
					 0,-1,-2,-1, 0,
					-1,-2,16,-2,-1,
					 0,-1,-2,-1, 0,
					 0, 0,-1, 0, 0, 
			}; 
			final int fSize = (int)Math.sqrt(filter.length);
			final int fSizeD2 = fSize/2;

			System.out.println("Image Size = (" + width + " x " + height + "), Type = " + image.getType());
			
			Raster inRaster = image.getData();
			int[] pixelsIn = new int[width*height*inRaster.getNumBands()];
			int[] pixelsOut = new int[pixelsIn.length];
			int[] pixelsOut2 = new int[pixelsIn.length];

			inRaster.getPixels(0, 0, width, height, pixelsIn);
			
			// filtering in Java
			long start = System.nanoTime();
			int[] rgb = new int[inRaster.getNumBands()];
			
			for(int v = 0; v < height; v++) {
				for(int u = 0; u < width; u++) {
					int[] sum = new int[inRaster.getNumBands()];
					
					// filter one pixel
					for (int j=0; j < fSize; j++) {
						int v0 = v + j - fSizeD2;
						if (v0 < 0) v0 = -v0;
						else if (v0 >= height) v0 = 2*height - v0 - 1;
						
						for (int i=0; i < fSize; i++) {
							final int fc = getFilterCoeff(filter, fSize, i, j);
							int u0 = u + i - fSizeD2;
							if (u0 < 0) u0 = -u0;
							else if (u0 >= width) u0 = 2*width - u0 - 1;
							
							getRGB(pixelsIn, width, u0, v0, rgb);
							for(int c = 0; c < inRaster.getNumBands(); c++) {
								sum[c] += rgb[c]*fc;
							}
						}					
					}
					for(int c = 0; c < inRaster.getNumBands(); c++) {
						sum[c] = clamp(128 + sum[c]);
					}
					setRGB(pixelsOut, width, u, v, sum);
				}
			}
			System.out.println("Java Time = " + (System.nanoTime() - start)/1000000.0 + " ms");

			// filtering in C++
			start = System.nanoTime();
			filtering(width, height, filter, pixelsIn, pixelsOut2);
			System.out.println("C++ Time = " + (System.nanoTime() - start)/1000000.0 + " ms");

			// compare results
			if (Arrays.equals(pixelsOut, pixelsOut2)) {
				System.out.println("Results are identical");

				WritableRaster outRaster = inRaster.createCompatibleWritableRaster();
				outRaster.setPixels(0, 0, width, height, pixelsOut);

				image.setData(outRaster);
				ImageIO.write(image, "jpeg", new File("Filter-" + fileName));
			} else {
				System.out.println("Results are different");

				WritableRaster outRaster = inRaster.createCompatibleWritableRaster();
				
				outRaster.setPixels(0, 0, width, height, pixelsOut);
				image.setData(outRaster);
				ImageIO.write(image, "jpeg", new File("Java-Filter-" + fileName));

				outRaster.setPixels(0, 0, width, height, pixelsOut2);
				image.setData(outRaster);
				ImageIO.write(image, "jpeg", new File("C++-Filter-" + fileName));
			}
		} catch(IOException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		inverting("Matterhorn.jpg");
		filtering("Matterhorn.jpg");
	}

}
